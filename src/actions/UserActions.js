import Reflux from 'reflux'

export default Reflux.createActions([
  'requestLogin',
  'requestLogout',
  'authUpdate',
  'alreadyLoggedIn',
  'notAlreadyLoggedIn',
  'loginSuccess',
  'logoutSuccess',
  'loginFailure'
])
