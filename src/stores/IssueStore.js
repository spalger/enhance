import Reflux from 'reflux'
import IssueActions from 'actions/IssueActions'
import request from 'superagent'
import config from 'config/index'

export default Reflux.createStore({
  listenables: IssueActions,

  /* returned object keys: url, labels_url, comments_url, events_url, html_url, id, number, title,
   user, labels (array), state, locked, comments (int), created_at, updated_at, pull_request (obj)
   body */
  onGetAll(since) {
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
      .get([ baseUrl, 'repos', author, repo, 'issues' ] .join('/'))
      .send(payload)
      //.set('Authorization', 'foobar')
      .end(function(error, res) {
        if (error) {
          console.log('Error getting all repo issues: ' + error);
        }

        if (res && res.text) {
          try {
            var issues = JSON.parse(res.text);
            console.log(issues);
          } catch (err) {
            console.log('Error parsing JSON while getting all repo issues');
          }
        }
      });
  },

  onCreate(title, body) {
    var { baseUrl, author, repo } = config;

    request
      .post([ baseUrl, 'repos', author, repo, 'issues' ] .join('/'))
      .send({ title: title, body : body })
      .set('Authorization', 'foobar') // required token
      .end(function(error, res) {
        if (error) {
          console.log('Error creating an issue: ' + error);
        }

        if (res) {
          console.log(res); // @todo handle response
        }
      });
  }
})
