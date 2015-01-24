import _ from 'lodash'
import Reflux from 'reflux'
import UserActions from 'actions/UserActions'
import Firebase from 'firebase/lib/firebase-web'
import log from 'lib/log'


export default Reflux.createStore({
  listenables: UserActions,

  user : {},

  _bindAuth: _.once(function () {
    this.ref.onAuth((auth) => {
      if (auth=== null) {
        console.log('logged out');
      } else {
        this.user = auth;
        this.trigger(this.user);
        log.success('Welcome ' + this.user.github.displayName || this.user.github.username);
        log.info('github payload', this.user);
      }
    })
  }),

  init: function () {
    this.ref = new Firebase("https://enhance.firebaseio.com");
    this._bindAuth();
  },


  onLogin: function () {
    this.ref.authWithOAuthPopup("github", onAuth, {
      scope: 'public_repo,gist' // @todo the end user doesnt need the gist scope, just contributors
    });

    function onAuth(error) {
      if (error) {
        log.error("Login Failed!", error);
      }
    }

  },

  onLogout : function () {
    log.success('You have been logged out');
    this.ref.unauth();
  },

  getGithubToken : function() {
    return this.user.github && this.user.github.accessToken;
  }
})
