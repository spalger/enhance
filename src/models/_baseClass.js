import _ from 'lodash'
import pouchdb from 'pouchdb'
import lunr from 'lunr'
import Promise from 'bluebird'
import log from 'lib/log'

export default class Model {
  constructor(name) {
    // lunr disabled by default
    this.indexer = null

    this.primaryKey = 'id'
    this.name = name
    this.db = new pouchdb(name, {
      adapter: 'idb'
    })

    // use events to pass records to the indexer
    this.db.changes({
      live: true
    })
    .on('create', (doc) => {
      this._indexAdd(doc)
    })
    .on('update', (doc) => {
      this._indexUpdate(doc)
    })
    .on('delete', (doc) => {
      this._indexDelete(doc)
    })
  }

  _id(doc) {
    if (doc._id) return doc._id
    return String(doc[this.primaryKey])
  }

  upsert(doc, cb) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.upsert(d)
      })
    }

    return this.get(this._id(doc))
    .then((d) => {
      if (doc.updated_at !== d.updated_at) {
        return this.update(doc, d._rev, cb)
      }
      return d
    })
    .catch((err) => {
      if (err.status === 404) {
        return this.db.put(doc, this._id(doc), cb)
      }
      throw err
    })
  }

  add(doc, cb) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.add(d)
      })
    }

    return this.db.put(doc, this._id(doc), cb)
  }

  update(doc, rev, cb) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.update(d)
      })
    }

    return this.db.put(doc, this._id(doc), rev, cb)
  }

  remove(doc, cb) {
    if (_.isArray(doc)) {
      return doc.map((d) => {
        return this.remove(d)
      })
    }

    return this.db.remove(doc, cb)
  }

  get(obj) {
    return this.db.get(obj)
  }

  query(fn, options, cb) {
    this.db.query(fn, options, cb)
  }

  // wrap lunr indexer
  search(query, cb) {
    if (!this.indexer) return []
    var p = Promise.map(this.indexer.search(query), (match) => {
      return this.get(match.ref)
    })

    return p.nodeify(cb)
  }

  // initialize lunr indexer
  _setIndexer(schema) {
    this.indexer = lunr(schema)
  }

  // custom handler required to index to lunr
  _indexAdd(doc) {
    if (!this.indexer) return
    this.get(doc.id).then((doc) => {
      log.msg('added to index')
      this.indexer.add(this._indexMap(doc))
    })
  }

  _indexUpdate(doc) {
    if (!this.indexer) return
    this.get(doc.id).then((doc) => {
      log.msg('updated in index')
      this.indexer.update(this._indexMap(doc))
    })
  }

  _indexRemove(doc) {
    if (!this.indexer) return
    this.get(doc.id).then((doc) => {
      log.msg('removed from')
      this.indexer.remove(this._indexMap(doc))
    })
  }

  _indexMapper(index) {
    return this.db.get(index.ref);
  }
}
