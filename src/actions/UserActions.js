import Reflux from 'reflux'

export default Reflux.createActions([
  'requireLogin',
  'rateLimitHit',
  'requestLogin',
  'requestLogout',
  'requestScopes',
  'authUpdate',
  'alreadyLoggedIn',
  'notAlreadyLoggedIn',
  'loginSuccess',
  'logoutSuccess',
  'loginFailure',
  'get',
  'ready'
])
