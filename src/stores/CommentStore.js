import Reflux from 'reflux'
import config from 'config'
import log from 'lib/log'
import github from 'lib/github'
import _ from 'lodash'

import log from 'lib/log'
import CommentActions from 'actions/CommentActions'
import github from 'lib/github'

var { org, repo, enhanceLabel } = config.github;

const UPVOTE = ':+1:'
const DOWNVOTE = ':-1:'

export default Reflux.createStore({
  listenables: CommentActions,

  init() {
    this.comments = []
  },

  onFetchCompleted(comments) {
    this.comments = comments
    this.trigger(this.comments)
  },

  onFetchFailed(err) {
    log.error('Failed to fetch comments', err)
  },

  onCreatsCompleted(comment) {
    log.success('Your comment was added to the issue')
    this.comments.push(comment)
    this.trigger(this.comments)
  },

  onCreateFailed(err) {
    log.error('Comment creation failed', err)
  },

  /* sample return object keys: url, html_url, issue_url, id, user, created_at, updated_at, body */
  onGetByIssue(issueNumber, since) {
    var payload = {
      labels: [ enhanceLabel ],
      sort: 'updated',
      direction: 'desc',
    }

    if (since) {
      payload.since = since
    }

    return github
    .method('get')
    .path(['repos', org, repo, 'issues', issueNumber, 'comments'])
    .query(payload)
    .send()
    .then((comments) => {
      this.comments = comments.body
      this.trigger(this.comments)
    })
    .catch((err) => {
      log.error('Error getting comments by issue', err)
    })
  },

  onUpvote(issueNumber) {
    return this._create(issueNumber, UPVOTE);
  },

  onDownvote(issueNumber) {
    return this._create(issueNumber, DOWNVOTE);
  },

  onComment(issueNumber, userComment) {
    return this._create(issueNumber, userComment);
  }
})
