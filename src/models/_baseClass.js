import _ from 'lodash'
import pouchdb from 'pouchdb'
import lunr from 'lunr'

export default class Model {
  constructor(name) {
    // lunr disabled by default
    this.indexer = null

    this.primaryKey = '_id'
    this.name = name
    this.db = new pouchdb(name, {
      adapter: 'idb'
    })

    // use events to pass records to the indexer
    this.db.changes({
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

  _id(doc) {
    if (doc._id) return doc._id
    return String(doc[this.primaryKey])
  }

  upsert(doc) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.upsert(d)
      })
    }

    return this.get(this._id(doc))
    .then((d) => {
      if (doc.updated_at !== d.updated_at) {
        return this.update(doc, d._rev)
      }
      return d
    })
    .catch((err) => {
      if (err.status === 404) {
        return this.db.put(doc, this._id(doc))
      }
      throw err
    })
  }

  add(doc) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.add(d)
      })
    }

    return this.db.put(doc, this._id(doc))
  }

  update(doc, rev) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.update(d)
      })
    }

    return this.db.put(doc, this._id(doc), rev)
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
    this.db.query(fn, options, cb)
  }

  // wrap lunr indexer
  search(query) {
    if (!this.indexer) return []
    return this.indexer.search(query).map(this._indexMapper)
  }

  // initialize lunr indexer
  _setIndexer(schema) {
    this.indexer = lunr(schema)
  }

  // custom handler required to index to lunr
  _indexAdd(doc) {
    if (!this.indexer) return
    this.indexer.add(this._indexMap(doc))
  }

  _indexUpdate(doc) {
    if (!this.indexer) return
    this.indexer.update(this._indexMap(doc))
  }

  _indexRemove(doc) {
    if (!this.indexer) return
    this.indexer.remove(this._indexMap(doc))
  }

  _indexMapper(index) {
    return this.db.get(index.ref);
  }
}
