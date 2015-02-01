import DBClass from 'models/_baseClass'

// create a lunr search object and when we get github issues, index into this
class IssueModel extends DBClass {
  constructor() {
    super('issues')

    // used to set and fetch records by id
    this.primaryKey = 'id'

    this._setIndexer(function () {
      this.field('number', { boost: 50 })
      this.field('title', { boost: 20 })
      this.field('body')
      this.ref('id')
    })

    this._indexMap = function (doc) {
      return {
        number: doc.number,
        title: doc.title,
        body: doc.body,
        id: doc._id,
      }
    }
  }
}

export default new IssueModel()