import loki from 'lokijs'
import config from 'config'

var db = new loki(config.storage.index, {
  persistenceMethod : 'localStorage'
})

try {
  db.loadDatabase()
} catch(err) {
  if (err.message === "Cannot read property 'collections' of null") {
    db.saveDatabase()
  } else {
    throw err
  }
}

// now that we know we have a database, let's auto persist
export default new loki(config.storage.index, {
  autosave: true,
  autoload: true,
  persistenceMethod : 'localStorage'
})