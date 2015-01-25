import Reflux from 'reflux'
import _ from 'lib/utils'
import log from 'lib/log'
import Firebase from 'firebase/lib/firebase-web'
import UserActions from 'actions/UserActions'

export default Reflux.createStore({
  user: null,
  listenables: UserActions,

  init: function () {
    this.ref = new Firebase('https://enhance.firebaseio.com/')
    this.ref.onAuth(UserActions.authUpdate, UserActions)
  },

  _setUser: function (fbUserData) {
    if (!fbUserData) {
      this.user = false;
    } else {
      if (!this.user) this.user = {}
      _.assign(this.user || {}, { profile: fbUserData.github.cachedUserProfile }, fbUserData)
    }

    this.trigger(this.user)
  },

  /**
   * Called by firebase anytime the auth state of the client changes
   *
   * {@link https://www.firebase.com/docs/web/api/firebase/onauth.html}
   * @param  {object} auth
   * @return {undefined}
   */
  onAuthUpdate: function (auth) {
    var prev = this.user
    this.ref.child('users').child(auth.uid).child('auth').set(auth);
    this._setUser(auth)

    if (prev === null) {
      if (this.user) UserActions.alreadyLoggedIn(this.user)
      else UserActions.notAlreadyLoggedIn()
    }
    else {
      if (this.user) UserActions.loginSuccess(this.user)
      else UserActions.logoutSuccess()
    }
  },

  onRequestLogin: function () {
    this._requestAuth('public_repo')
  },

  onRequestScopes: function (scopes) {
    scopes = [this.user.scopes, scopes.join(',')].join(',')
    this._requestAuth(scopes)
  },

  _requestAuth: function (scope) {
    function checkForFail(err) {
      if (err) UserActions.loginFailure(err)
    }

    this.ref.authWithOAuthPopup('github', checkForFail, { scope })
  },

  onRequestLogout: function () {
    this.ref.unauth()
  },

  onLoginSuccess: function () {
    log.success('Welcome ' + this.user.github.displayName || this.user.github.username);
  },

  onLoginFailure: function (err) {
    log.error('login failure', err)
  },

  onLogoutSuccess: function () {
    log.success('You have been logged out');
  },

  onAlreadyLoggedIn: function (user) {
    log.info('user is logged in', user)
    this._setUser(user)
  },

  onNotAlreadyLoggedIn: function () {
    log.info('user it not logged in')
    this._setUser(false)
  },

  getGithubToken: function() {
    return _.get(this, 'user.github.accessToken')
  },

  isLoggedIn: function () {
    return !!this.getGithubToken()
  },

  updateScopes: function (scopes) {
    this.ref.child('users').child(this.user.uid).child('scopes').set(scopes)
    _.assign(this.user, { scopes })
    log.msg('update scopes', scopes)
  }
})
