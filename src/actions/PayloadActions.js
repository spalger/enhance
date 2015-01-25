import Reflux from 'reflux'

var actions = Reflux.createActions({
  'persist': { asyncResult: true },
  'get': { asyncResult: true }
})

export default actions