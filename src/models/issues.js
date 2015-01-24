import DBClass from 'models/_baseClass'

// create a lunr search object and when we get github issues, index into this
class Issues extends DBClass {
  constructor() {
    super('issues')

    this.primaryKey = 'id'

    this._setIndexer(function () {
      this.field('title', { boost: 10 })
      this.field('number', { boost: 50 })
      this.ref('_id')
    })

    this._indexMap = function (doc) {
      return {
        title : doc.title,
        number : doc.number,
        ref : doc._id,
      }
    }
  }
}

export default new Issues()