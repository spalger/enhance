import _ from 'lodash'
import pouchdb from 'pouchdb'
import lunr from 'lunr'

export default class Model {
  constructor(name) {

    // lunr disabled by default
    this.indexer = null

    this.name = name
    this db = new pouchdb(name, {
      adapter: 'http'
    })
    this.collection = this.db.getCollection(this.name)
    if (!this.collection) {
      this.collection = this.db.addCollection(this.name)
    }

    // use events to pass records to the indexer
    db.changes({
      since: 'now',
    })
    .on('create', (doc) => {
      if (!this.indexer) return
      this._indexAdd(doc)
    })
    .on('update', (doc) => {
      if (!this.indexer) return
      this._indexUpdate(doc)
    })
    .on('delete', (doc) => {
      if (!this.indexer) return
      this._indexDelete(doc)
    })
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

    return this.db.post(doc)
  }

  update(doc) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.update(d)
      })
    }

    return this.db.put(doc)
  }

  remove(doc) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.remove(d)
      })
    }

    return this.db.remove(doc)
  }

  get(obj) {
    return this.db.get(obj)
  }

  query(fn, options, cb) {
    this.db.query(fn, options)
  }

  // wrap lunr indexer
  search(query) {
    if (!this.indexer) return []
    return this.indexer.search(query).map(this._indexMapper)
  }
}
