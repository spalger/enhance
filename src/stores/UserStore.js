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
      this.ref.child('users').child(fbUserData.uid).child('auth').set(fbUserData)
      this.ref.child('users').child(fbUserData.uid).child('scopes').once('value', (snapshop) => {
        this.user.scopes = snapshop.val()
      })
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

    this._setUser(auth)

    // triggered the first time the app is loaded
    if (prev === null) {
      if (this.user) UserActions.alreadyLoggedIn(this.user)
      else UserActions.notAlreadyLoggedIn()
    } else {
      if (this.user) UserActions.loginSuccess(this.user)
      else UserActions.logoutSuccess()
    }
  },

  onRequestLogin: function () {
    this._requestAuth('public_repo')
  },

  onRequestScopes: function (scopes) {
    if (_.isArray(scopes)) scopes = scopes.join(',')
    this._requestAuth(scopes)
  },

  _requestAuth: function (scope) {
    function checkForFail(err) {
      if (err) UserActions.loginFailure(err)
    }

    // if the user already has scopes applied, append them
    scope = (this.user.scopes) ? [this.user.scopes, scope].join(',') : scope
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
    UserActions.ready()
  },

  onNotAlreadyLoggedIn: function () {
    log.info('user is not logged in')
    UserActions.ready()
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
