import Reflux from 'reflux'

export default Reflux.createActions([
  'requireLogin',
  'requestLogin',
  'requestLogout',
  'requestScopes',
  'authUpdate',
  'alreadyLoggedIn',
  'notAlreadyLoggedIn',
  'loginSuccess',
  'logoutSuccess',
  'loginFailure',
  'get'
])
