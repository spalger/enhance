import loki from 'lokijs'
import issuesSearch from 'models/issues'

var db = new loki('enhance.json', {
  persistenceMethod : 'localStorage'
})

var issuesTable = db.addCollection('issues')
var commentsTable = db.addCollection('comments')

export default {

  loadDatabase() {
    db.loadDatabase()
  },

  _indexIssueIntoLunr(issue) {
    issuesSearch.add({
      ref : issue.number,
      title : issue.title,
      comment : issue.comments
    })
  },

  insertIssue(issue) {
    issuesTable.insert(issue)

    this._indexIssueIntoLunr(issue)

    db.saveDatabase()
  },

  insertComment(comment) {
    commentsTable.insert(comment)
    db.saveDatabase()
  },

  getAllIssues() {
    return loki.db().getCollection('issues').data;
  },

  getAllComments() {
    return loki.db().getCollection('comments').data;
  },

  getCommentsById(commentIds) {
    return loki.db().getCollection('comments').find({ number : { $in : commentIds }})
  },

  getIssuesById(issueIds) {
    return loki.db().getCollection('issues').find({ number : { $in : issueIds }})
  },

  db() {
    return db; // if we need a reference to loki itself
  }
}