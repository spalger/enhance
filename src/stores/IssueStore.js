import _ from 'lodash'
import Reflux from 'reflux'
import request from 'superagent'
import config from 'config'

import IssueActions from 'actions/IssueActions'
import UserStore from 'stores/UserStore'
import Issues from 'models/issues'

var { apiUrl, author, repo, enhanceLabel } = config.github;
var defaultPerPage = 100;

function fetchIssues(options, cb) {
  options = options || {}
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  var payload = _.defaults(options, {
    labels : [ enhanceLabel ],
    per_page: defaultPerPage,
    sort : 'updated',
    direction : 'desc',
  })

  request
  .get([ apiUrl, 'repos', author, repo, 'issues' ].join('/'))
  .query(payload)
  //.set('Authorization', 'foobar')
  .end(cb);
}

export default Reflux.createStore({
  listenables: IssueActions,

  issues : [],

  /* returned object keys: url, labels_url, comments_url, events_url, html_url, id, number, title,
   user, labels (array), state, locked, comments (int), created_at, updated_at, pull_request (obj)
   body */
  onFetch(options) {
    fetchIssues(options, (error, res) => {
      var issues;

      if (error) {
        console.log('Error getting all repo issues: ' + error);
      }

      if (res && res.body) {
        issues = res.body
      } else if (res && res.text) {
        try {
          issues = JSON.parse(res.text)
        } catch (err) {
          throw err
        }
      } else {
        throw new Error('Could not parse response')
      }

      // update db with any changed results
      Issues.upsert(issues);
      this.trigger(issues);
    });
  },

  onPayload(options) {
    options = options || {}
    var currentPage = options.page || 1

    var _payloadBuilder = (err, res) => {
      // TODO: store issues

      if (res.body.length === defaultPerPage) {
        this.onPayload({ page: currentPage+1 })
      }
    }

    fetchIssues(options, _payloadBuilder);
  },

  onCreate(title, body) {
    var token = UserStore.getGithubToken()

    if (! token) {
      return console.error('Login required');
    }

    request
      .post([ apiUrl, 'repos', author, repo, 'issues' ] .join('/'))
      .send({ title: title, body : body })
      .set('Authorization', 'token ' + token) // required token
      .end(function(error, res) {
        if (error) {
          console.log('Error creating an issue: ' + error);
        }

        if (res) {
          console.log(res); // @todo handle response
        }
      });
  },

  onSearch(keyboardEvent) {
    var results = Issues.search(keyboardEvent.target.value); //contains id and score
    var returnedIssues = [];
    var self = this;

    _.each(results, function(result) {
      _.each(self.issues, function(issue) {
        if (_.isEqual(issue.number, Number(result.ref))) {
          returnedIssues.push(issue);
        }
      });
    });

    console.log('search results : ', returnedIssues);
  }
})
