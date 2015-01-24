import Reflux from 'reflux'
import request from 'superagent'
import config from 'config'

import CommentActions from 'actions/CommentActions'
import UserStore from 'stores/UserStore'

var { apiUrl, author, repo, enhanceLabel } = config.github;
const UPVOTE = ':+1:'
const DOWNVOTE = ':-1:'

export default Reflux.createStore({
  listenables: CommentActions,

  _create(issueNumber, comment) {
    var token = UserStore.getGithubToken()

    request
      .post([ apiUrl, 'repos', author, repo, 'issues', issueNumber, 'comments' ] .join('/'))
      .send({ body : comment })
      .set('Authorization', 'token ' + token) // required token
      .end(function(error, res) {
        if (error) {
          console.log('Error creating a comment: ' + error);
        }

        if (res) {
          console.log(res); // @todo handle response
        }
      });
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

    request
      .get([ apiUrl, 'repos', author, repo, 'issues', issueNumber, 'comments' ] .join('/'))
      //.send({ sort : 'updated', direction : 'desc', since : '2015-01-01 })
      //.set('Authorization', 'foobar')
      .end(function(error, res) {
        if (error) {
          console.log('Error getting all repo comments: ' + error);
        }

        if (res && res.text) {
          try {
            var comments = JSON.parse(res.text);
            console.log(comments);
          } catch (err) {
            console.log('Error parsing JSON while getting all repo comments');
          }
        }
      });
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
