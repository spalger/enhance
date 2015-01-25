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

  _reloadPage() {
    window.location.reload()
  },

  /* returned object keys: url, labels_url, comments_url, events_url, html_url, id, number, title,
   user, labels (array), state, locked, comments (int), created_at, updated_at, pull_request (obj)
   body */
  onFetch(options) {
    this._fetchIssues(options)
    .then((res) => {
      // update db with any changed results
      this.trigger(res);
    })
    .catch((err) => {
      if(err.resp && err.resp.status && err.resp.status === 403) {
        log.error('Error getting issues, you have reached the Github rate limit. Please login to continue');
        this.listenTo(UserActions.loginSuccess, this._reloadPage);
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
        this.listenTo(UserActions.loginSuccess, this._reloadPage);
        UserActions.requireLogin()
      } else {
        log.error('Unable to fetch issue');
        IssueActions.fetchByIdFailed(issueId);
      }
    })
  },

  // recursive method to fetch all issues using IssueStore
  onFetchAll(options) {
    var self = this;
    var allIssues = [];
    options = _.defaults(options || {}, { page: 1 })

    function fetch() {
      return self._fetchIssues(options)
      .then((issues) => {
        allIssues = allIssues.concat(issues)
        if (issues.length === self.defaultPerPage) {
          ++options.page
          return fetch()
        }
      })
      .catch((err) => {
        if(err.resp && err.resp.status && err.resp.status === 403) {
          log.error('Error getting issue, you have reached the Github rate limit. Please login to continue')
          self.listenTo(UserActions.loginSuccess, self._reloadPage);
          UserActions.requireLogin()
        } else {
          log.error('Unable to fetch issue');
        }
      })
    }

    return fetch()
    .then(() => {
      this.issues = allIssues;
      this.trigger(allIssues)
      return allIssues
    })
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
    if (! keyboardEvent.target.value) {
      return this.trigger(this.issues)
    }

    issueModel.search(keyboardEvent.target.value)
    .then((results) => {
      this.trigger(results);
    })
  },

  _fetchIssues(options) {
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