import DBClass from 'models/_baseClass'

// create a lunr search object and when we get github issues, index into this
class Issues extends DBClass {
  constructor() {
    super('issues')
    this.indexRef = 'number'
    this._setIndexer(function () {
      this.field('title', { boost: 10 })
      this.field('comments')
      this.ref('id')
    })

  }

  _indexAdd(issue) {
    this.indexer.add({
      ref : issue.number,
      title : issue.title,
      comment : issue.comments
    })
  }
}

export default new Issues()