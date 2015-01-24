import _ from 'lib/utils'
import log from 'lib/log'
import Reflux from 'reflux'
import Firebase from 'firebase/lib/firebase-web'
import UserActions from 'actions/UserActions'


export default Reflux.createStore({
  user: null,
  listenables: UserActions,

  init: function () {
    this.ref = new Firebase('https://enhance.firebaseio.com')
    this.ref.onAuth(UserActions.authUpdate, UserActions)
  },

  _setUser: function (fbUserData) {
    if (!fbUserData) {
      this.user = false;
    } else {
      this.user = Object.create(fbUserData, {
        profile: {
          get() {
            return this.github.cachedUserProfile;
          }
        }
      });
    }

    this.trigger(this.user);
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
    var scope = 'public_repo,gist'
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
  }
})
