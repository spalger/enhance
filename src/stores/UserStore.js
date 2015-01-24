import Reflux from 'reflux'
import UserActions from 'actions/UserActions'
import Firebase from 'firebase/lib/firebase-web'
import log from 'lib/log'

var ref = new Firebase("https://enhance.firebaseio.com");

export default Reflux.createStore({
  listenables: UserActions,

  user : {},
  _eventBound: false,

  getInitialState : function() {
    if (!this._eventBound) {
      ref.onAuth((auth) => {
        if (auth=== null) {
          console.log('logged out');
        } else {
          this.user = auth;
          this.trigger(this.user);
          log.success('logged in with github');
          log.info('github payload', this.user);
        }
      })
      this._eventBound = true
    }
  },

  onLogin: function () {
    ref.authWithOAuthPopup("github", onAuth, {
      scope: 'public_repo'
    });

    function onAuth(error) {
      if (error) {
        log.error("Login Failed!", error);
      }
    }

  },

  onLogout : function () {
    ref.unauth();
  },

  getGithubToken : function() {
    return this.user.github && this.user.github.accessToken;
  }
})
