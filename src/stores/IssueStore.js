import _ from 'lodash'
import Reflux from 'reflux'

import config from 'config'
import github from 'lib/github'
import log from 'lib/log'
import IssueActions from 'actions/IssueActions'
import UserStore from 'stores/UserStore'
import issueModel from 'models/issueModel'

var { author, repo, enhanceLabel } = config.github;
var defaultPerPage = 100;

function fetchIssues(options) {
  return github
  .path(['repos', author, repo, 'issues'])
  .query(_.defaults(options, {
    labels: [ enhanceLabel ],
    per_page: defaultPerPage,
    sort: 'updated',
    direction: 'desc',
  }))
  .send()
  .then(function (issues) {
    issueModel.upsert(issues);
    return issues;
  });
}

export default Reflux.createStore({
  listenables: IssueActions,

  issues: [],

  /* returned object keys: url, labels_url, comments_url, events_url, html_url, id, number, title,
   user, labels (array), state, locked, comments (int), created_at, updated_at, pull_request (obj)
   body */
  onFetch(options) {
    fetchIssues(options)
    .then((res) => {
      // update db with any changed results
      this.trigger(res.body);
    })
    .catch((err) => {
      log.error('Error getting all repo issues:', err);
    });
  },

  onPayload(options) {
    options = options || {}
    var currentPage = options.page || 1

    return fetchIssues(options)
    .then((res) => {
      if (res.body.length === defaultPerPage) {
        this.onPayload({ page: currentPage+1 })
      }
    });
  },

  onCreate(title, body) {
    if (!UserStore.isLoggedIn()) {
      return log.error('Login required');
    }

    return github
    .path(['repos', author, repo, 'issues'])
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
  }
})
