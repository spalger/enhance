import _ from 'lodash'
import Reflux from 'reflux'
import lunr from 'lunr'
import request from 'superagent'
import config from 'config'

import IssueActions from 'actions/IssueActions'
import UserStore from 'stores/UserStore'

var { apiUrl, author, repo, enhanceLabel } = config.github;


// create a lunr search object and when we get github issues, index into this
var issueIndex = lunr(function () {
  this.field('title', { boost: 10 })
  this.field('comments')
  this.ref('id')
})

export default Reflux.createStore({
  listenables: IssueActions,

  issues : [],

  /* returned object keys: url, labels_url, comments_url, events_url, html_url, id, number, title,
   user, labels (array), state, locked, comments (int), created_at, updated_at, pull_request (obj)
   body */
  onGetAll(since) {
    var payload = {
      labels : [ enhanceLabel ],
      sort : 'updated',
      direction : 'desc',
    }
    var self = this;

    if (since) {
      payload.since = since
    }

    request
      .get([ apiUrl, 'repos', author, repo, 'issues' ] .join('/'))
      .send(payload)
      //.set('Authorization', 'foobar')
      .end(function(error, res) {
        if (error) {
          console.log('Error getting all repo issues: ' + error);
        }

        if (res && res.text) {
          try {
            self.issues = JSON.parse(res.text);
            self._indexIssuesIntoLunr(self.issues);
            self.trigger(self.issues);
            console.log(self.issues);
          } catch (err) {
            console.log('Error parsing JSON while getting all repo issues');
          }
        }
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
    _.each(issues, function(issue) {
      console.log('Indexing issue: ', issue);
      issueIndex.add({
        title : issue.title,
        comments : issue.comments,
        id : issue.number
      })
    })
  },

  onSearch(keyboardEvent) {
    var lunrResults = issueIndex.search(keyboardEvent.target.value); //contains id and score
    var returnedIssues = [];
    var self = this;

    _.each(lunrResults, function(result) {
      _.each(self.issues, function(issue) {
        if (_.isEqual(issue.number, Number(result.ref))) {
          returnedIssues.push(issue);
        }
      });
    });

    console.log('search results : ', returnedIssues);
  }
})
