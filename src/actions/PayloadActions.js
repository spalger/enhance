import Reflux from 'reflux'

var actions = Reflux.createActions({
  'generate': { asyncResult: true },
  'get': { asyncResult: true }
})

export default actions