import Reflux from 'reflux'

export default Reflux.createActions([
  'requireLogin',
  'requestLogin',
  'requestLogout',
  'authUpdate',
  'alreadyLoggedIn',
  'notAlreadyLoggedIn',
  'loginSuccess',
  'logoutSuccess',
  'loginFailure',
  'get'
])
