import _ from 'lodash'
import Reflux from 'reflux'
import UserActions from 'actions/UserActions'
import Firebase from 'firebase/lib/firebase-web'


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
        console.log("Authenticated successfully with payload:", this.user); // Leave until launch
      }
    })
  }),

  init: function () {
    this.ref = new Firebase("https://enhance.firebaseio.com");
    this._bindAuth();
  },


  onLogin: function () {
    this.ref.authWithOAuthPopup("github", onAuth, {
      scope: 'public_repo'
    });

    function onAuth(error) {
      if (error) {
        console.log("Login Failed!", error);
      }
    }

  },

  onLogout : function () {
    this.ref.unauth();
  },

  getGithubToken : function() {
    return this.user.github && this.user.github.accessToken;
  }
})
