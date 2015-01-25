import _ from 'lodash'
import Promise from 'bluebird'

export default function (...listenables) {
  listenables = _.flatten(listenables)
  if (!listenables.length) return Promise.resolve()

  var unsubs = []

  return Promise.any(listenables.map(function (listenable) {
    return new Promise(function (resolve) {
      unsubs.push(listenable.listen(function () {
        resolve(listenable)
      }))
    })
  }))
  .finally(function () {
    unsubs.forEach(function (unsub) {
      unsub()
    })
  })
}