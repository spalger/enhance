import _ from 'lodash'
import db from 'lib/initDb'
import lunr from 'lunr'

export default class Model {
  constructor(name) {
    // lunr disabled by default
    this.indexer = null

    this.name = name
    this.db = db
    this.collection = this.db.addCollection(this.name)
  }

  // initialize lunr indexer
  _setIndexer(schema) {
    this.indexer = lunr(schema)
  }

  // custom handler required to index to lunr
  _indexAdd(/* doc */) {}
  _indexUpdate(/* doc */) {}
  _indexRemove(/* doc */) {}

  _indexMapper(index) {
    return this.collection.get(index.ref);
  }

  add(doc) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.add(d)
      })
    }

    this._indexAdd(doc)
    return this.collection.insert(doc)
  }

  update(doc) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.update(d)
      })
    }

    this._indexUpdate(doc)
    return this.collection.update(doc)
  }

  remove(doc) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.remove(d)
      })
    }

    this._indexRemove(doc)
    return this.collection.insert(doc)
  }

  find(obj) {
    return this.collection.find(obj)
  }

  // wrap lunr indexer
  search(query) {
    if (!this.indexer) return []
    return this.indexer.search(query).map(this._indexMapper)
  }
}
