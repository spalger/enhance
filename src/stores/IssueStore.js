import _ from 'lodash'
import Reflux from 'reflux'

import log from 'lib/log'
import IssueActions from 'actions/IssueActions'
import UserStore from 'stores/UserStore'
import UserActions from 'actions/UserActions'
import issueModel from 'models/issueModel'

export default Reflux.createStore({
  listenables: IssueActions,

  init() {
    this.issues = []
    this.defaultPerPage = 30
  },

  onFetchCompleted(issues) {
    // TODO: paginate results
    this.issues = issues
    this.trigger(this.issues)
  },

  onFetchFailed(err) {
    log.error('Error getting issues', err);
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

  onSearch(keyboardEvent) {
    if (! keyboardEvent.target.value) {
      return this.trigger(this.issues)
    }

    issueModel.search(keyboardEvent.target.value)
    .then((results) => {
      this.trigger(results);
    })
  }
})