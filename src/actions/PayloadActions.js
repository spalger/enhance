import Reflux from 'reflux'

var actions = Reflux.createActions({
  'generate': { asyncResult: true },
  'save': { asyncResult: true },
  'get': { asyncResult: true }
})

export default actions