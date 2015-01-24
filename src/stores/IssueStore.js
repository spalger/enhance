import Reflux from 'reflux'
import IssueActions from 'actions/IssueActions'
import request from 'superagent'
import config from 'config/index'

export default Reflux.createStore({
  listenables: IssueActions,

  onGetAll(since) {
    var { baseUrl, author, repo, enhanceLabel } = config;

    console.log(config);

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
  }
})
