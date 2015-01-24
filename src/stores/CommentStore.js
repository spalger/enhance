import Reflux from 'reflux'
import CommentActions from 'actions/CommentActions'
import request from 'superagent'
import config from 'config/index'

export default Reflux.createStore({
  listenables: CommentActions,

  /* sample return object keys: url, html_url, issue_url, id, user, created_at, updated_at, body */
  /* @todo since is the MouseEvent currently */
  onGetByIssue(issueNumber, since) {
    console.log(issueNumber, since);
    var { baseUrl, author, repo, enhanceLabel } = config;

    var payload = {
      labels : [ enhanceLabel ],
      sort : 'updated',
      direction : 'desc',
    }

    if (since) {
      payload.since = since
    }

    request
      .get([ baseUrl, 'repos', author, repo, 'issues', issueNumber, 'comments' ] .join('/'))
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
  }
})
