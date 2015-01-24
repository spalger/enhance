import _ from 'lodash'
import Reflux from 'reflux'
import request from 'superagent'
import config from 'config'

import IssueActions from 'actions/IssueActions'
import UserStore from 'stores/UserStore'
import issueIndex from 'models/issues'

var { apiUrl, author, repo, enhanceLabel } = config.github;

function fetchIssues(options, cb) {
  options = options || {}
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  var payload = _.defaults(options, {
    labels : [ enhanceLabel ],
    sort : 'updated',
    direction : 'desc',
  })

  request
  .get([ apiUrl, 'repos', author, repo, 'issues' ].join('/'))
  .send(payload)
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
      if (error) {
        console.log('Error getting all repo issues: ' + error);
      }

      if (res && res.body) {
        this.issues = res.body
      } else if (res && res.text) {
        try {
          this.issues = JSON.parse(res.text)
        } catch (err) {
          throw err
        }
      } else {
        throw new Error('Could not parse response')
      }

      this._indexIssuesIntoLunr(this.issues);
      this.trigger(this.issues);
      console.log(this.issues);
    });
  },

  onPayload() {
    fetchIssues((err, res) => {
      var pageCount = 1;

      // link header means more than one page
      if (res.headers.link) {
        // fetch the largest page number, that's the total page count
        var r = /page=(\d+)/g;
        var matches = res.headers.link.match(r)
        pageCount = matches.reduce(function (prev, str) {
          var page = parseInt(str.split('=')[1])
          if (page > prev) return page
        }, 0)
      }

      // TODO: make sure X-RateLimit-Remaining > pageCount
      // TODO: store issues
      // TODO: call fetchIssues pageCount - 1 times, storing each time
    });
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

  _indexIssuesIntoLunr(issues) {
    _.each(issues, (issue) => {
      console.log('Indexing issue: ', issue);
      issueIndex.add({
        title : issue.title,
        comments : issue.comments,
        id : issue.number
      })
    })
  },

  onSearch(keyboardEvent) {
    var results = issueIndex.search(keyboardEvent.target.value); //contains id and score
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
