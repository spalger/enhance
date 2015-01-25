import Reflux from 'reflux'
import config from 'config'
import log from 'lib/log'
import github from 'lib/github'
import _ from 'lodash'

import log from 'lib/log'
import CommentActions from 'actions/CommentActions'
import github from 'lib/github'

var { author, repo, enhanceLabel } = config.github;

const UPVOTE = ':+1:'
const DOWNVOTE = ':-1:'

export default Reflux.createStore({
  listenables: CommentActions,

   comments : [],

  _create(issueNumber, comment) {
    return github
    .method('post')
    .path(['repos', author, repo, 'issues', issueNumber, 'comments'])
    .body({ body: comment })
    .send()
    .then(() => {
      if(_.isEqual(comment, UPVOTE)) {
        log.success('Your upvote was added to the issue')
        CommentActions.upvoteSuccess(issueNumber)
      } else if(_.isEqual(comment, DOWNVOTE)) {
        log.success('Your downvote was added to the issue')
        CommentActions.downvoteSuccess(issueNumber)
      } else {
        log.success('Your comment was added to the issue')
        CommentActions.commentAddSuccess(issueNumber)
      }
    })
    .catch((err) => {
      log.error('Error creating comment', err)
    })
  },

  /* sample return object keys: url, html_url, issue_url, id, user, created_at, updated_at, body */
  /* @todo since is the MouseEvent currently */
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
    .path(['repos', author, repo, 'issues', issueNumber, 'comments'])
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
