import _ from 'lodash'
import Reflux from 'reflux'

import config from 'config'
import github from 'lib/github'
import log from 'lib/log'
import IssueActions from 'actions/IssueActions'
import UserStore from 'stores/UserStore'
import UserActions from 'actions/UserActions'
import issueModel from 'models/issueModel'

var { org, repo, enhanceLabel } = config.github;

export default Reflux.createStore({
  listenables: IssueActions,

  issues: [],

  issue : {}, // single issue loaded on detail page
  defaultPerPage: 100,

  /* returned object keys: url, labels_url, comments_url, events_url, html_url, id, number, title,
   user, labels (array), state, locked, comments (int), created_at, updated_at, pull_request (obj)
   body */
  onFetch(options) {
    this.fetchIssues(options)
    .then((res) => {
      // update db with any changed results
      this.trigger(res);
    })
    .catch((err) => {
      if(err.resp && err.resp.status && err.resp.status === 403) {
        log.error('Error getting issues, you have reached the Github rate limit. Please login to continue');
        UserActions.requireLogin();
      } else {
        log.error('Error getting issues', err);
      }
    });
  },

  onFetchById(issueId) {
    // @todo should this pull from issueModel versus making a request?
    return github
    .path(['repos', org, repo, 'issues', issueId])
    .then((issue) => {
      this.issue = issue.body;
      this.trigger(this.issue);
    })
    .catch((err) => {
      if(err.resp && err.resp.status && err.resp.status === 403) {
        log.error('Error getting issue, you have reached the Github rate limit. Please login to continue')
        UserActions.requireLogin()
      } else {
        log.error('Unable to fetch issue');
        IssueActions.fetchByIdFailed(issueId);
      }
    })
  },

  onFetchAll(options) {
    options = options || {}
    var currentPage = options.page || 1

    return this.fetchIssues(options)
    .then((issues) => {
      if (issues.length === this.defaultPerPage) {
        return this.onFetchAll({ page: ++currentPage })
      }
      return issues.length + ((currentPage - 1) * this.defaultPerPage)
    });
  },

  onCreate(title, body) {
    if (!UserStore.isLoggedIn()) {
      return log.error('Login required');
    }

    return github
    .path(['repos', org, repo, 'issues'])
    .method('post')
    .body({ title: title, body: body })
    .send();
  },

  onSearch(keyboardEvent) {
    var results = issueModel.search(keyboardEvent.target.value); //contains refs and score
    var returnedIssues = [];
    var self = this;

    _.each(results, function(result) {
      _.each(self.issues, function(issue) {
        if (_.isEqual(issue.number, Number(result.ref))) {
          returnedIssues.push(issue);
        }
      });
    });

    log.info('Search results: ', returnedIssues.length);
  },

  fetchIssues(options) {
    return github
    .path(['repos', org, repo, 'issues'])
    .query(_.defaults(options || {}, {
      labels: [ enhanceLabel ],
      per_page: this.defaultPerPage,
      sort: 'updated',
      direction: 'desc',
    }))
    .then(function (issues) {
      return issueModel.upsert(issues.body)
      .then(function () {
        return issues.body
      });
    });
  }
})