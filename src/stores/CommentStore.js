import Reflux from 'reflux'
import config from 'config'
import log from 'lib/log'
import github from 'lib/github'

import CommentActions from 'actions/CommentActions'

var { author, repo, enhanceLabel } = config.github;
const UPVOTE = ':+1:'
const DOWNVOTE = ':-1:'

export default Reflux.createStore({
  listenables: CommentActions,

  _create(issueNumber, comment) {
    github
      .method('post')
      .path([ 'repos', author, repo, 'issues', issueNumber, 'comments' ])
      .body({ body : comment })
      .send()
      .then((response) => {
        log.msg(response.body);
      })
  },

  /* sample return object keys: url, html_url, issue_url, id, user, created_at, updated_at, body */
  /* @todo since is the MouseEvent currently */
  onGetByIssue(issueNumber, since) {
    var payload = {
      labels : [ enhanceLabel ],
      sort : 'updated',
      direction : 'desc',
    }

    if (since) {
      payload.since = since
    }

    github
      .method('get')
      .path([ 'repos', author, repo, 'issues', issueNumber, 'comments' ])
      .send()
      .then((comments) => {
        log.msg(comments);
      })
  },

  onUpvote(issueNumber) {
    this._create(issueNumber, UPVOTE);
  },

  onDownvote(issueNumber) {
    this._create(issueNumber, DOWNVOTE);
  },

  onComment(issueNumber, userComment) {
    this._create(issueNumber, userComment);
  }
})
