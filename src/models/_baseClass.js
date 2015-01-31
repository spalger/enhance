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

  _getDocs(docs, opts) {
    if (!opts || opts.include_docs) {
      return docs.rows.map(function(row) {
        return row.doc
      })
    }

    return docs
  }

  upsert(doc, cb) {
    if (_.isArray(doc)) {
      return Promise.map(doc, (d) => {
        return this.upsert(d)
      })
    }

    return this.get(this._id(doc))
    .then((d) => {
      if (doc.updated_at !== d.updated_at) {
        return Promise.resolve(this.update(doc, d._rev)).nodeify(cb)
      }
      return d
    })
    .catch((err) => {
      if (err.status === 404) {
        return Promise.resolve(this.db.put(doc, this._id(doc))).nodeify(cb)
      }
      throw err
    })
  }

  add(doc, cb) {
    if (_.isArray(doc)) {
      return Promise.map(doc, (d) => {
        return this.add(d)
      })
    }

    return Promise.resolve(this.db.put(doc, this._id(doc))).nodeify(cb)
  }

  update(doc, rev, cb) {
    if (_.isArray(doc)) {
      return Promise.map(doc, (d) => {
        return this.update(d)
      })
    }

    return Promise.resolve(this.db.put(doc, this._id(doc), rev)).nodeify(cb)
  }

  remove(doc, cb) {
    if (_.isArray(doc)) {
      return Promise.map(doc, (d) => {
        return this.remove(d)
      })
    }

    return Promise.resolve(this.db.remove(doc)).nodeify(cb)
  }

  get(obj, cb) {
    return Promise.resolve(this.db.get(obj)).nodeify(cb)
  }

  fetch(opt, cb) {
    opt = _.defaults(opt || {}, { include_docs: true })

    var docs = this.db.allDocs(opt)
    .then(this._getDocs)

    return Promise.resolve(docs).nodeify(cb)
  }

  query(fn, options, cb) {
    options = _.defaults(options || {}, {
      include_docs: true
    })
    return Promise.resolve(this.db.query(fn, options)).nodeify(cb)
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
