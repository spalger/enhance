var request = require('superagent');

var baseUrl = 'https://api.github.com';
var author = 'spoike';
var repo = 'refluxjs';
var issueNumber = 1;

/* GET ALL COMMENTS BY ISSUE NUMBER */
/* sample return object keys: url, html_url, issue_url, id, user, created_at, updated_at, body

*/

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


/* GET ALL ISSUES */
/* returned object keys: url, labels_url, comments_url, events_url, html_url, id, number, title,
   user, labels (array), state, locked, comments (int), created_at, updated_at, pull_request (obj)
   body */
request
  .get([ baseUrl, 'repos', author, repo, 'issues' ] .join('/'))
  //.send({ labels : 'enhance', sort : 'updated', direction : 'desc', since : '2015-01-1' })
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

/* CREATE A COMMENT */
// /repos/:owner/:repo/issues/:number/comments
request
  .post([ baseUrl, 'repos', author, repo, 'issues', issueNumber, 'comments' ] .join('/'))
  //.send({ body : ':+1:' })
  //.set('Authorization', 'foobar')
  .end(function(error, res) {
    if (error) {
      console.log('Error creating a comment: ' + error);
    }

    if (res) {
      console.log(res);
    }
  });

/* CREATE AN ISSUE */
// POST /repos/:owner/:repo/issues
request
  .post([ baseUrl, 'repos', author, repo, 'issues' ] .join('/'))
  //.send({ title: 'New issue title', body : 'Issue description', labels: [ 'enhance' ] })
  //.set('Authorization', 'foobar')
  .end(function(error, res) {
    if (error) {
      console.log('Error creating an issue: ' + error);
    }

    if (res) {
      console.log(res);
    }
  });