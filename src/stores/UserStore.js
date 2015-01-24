import Reflux from 'reflux'
import UserActions from 'actions/UserActions'
import Firebase from 'firebase/lib/firebase-web'

var ref = new Firebase("https://enhance.firebaseio.com");

export default Reflux.createStore({
  listenables: UserActions,

  user : {},

  getInitialState : function() {
    ref.onAuth((auth) => {
      if (auth=== null) {
        console.log('logged out');
      } else {
        this.user = auth;
        this.trigger(this.user);
        console.log("Authenticated successfully with payload:", this.user); // Leave until launch
      }
    })
  },

  onLogin: function () {
    ref.authWithOAuthPopup("github", onAuth, {
      scope: 'public_repo'
    });

    function onAuth(error) {
      if (error) {
        console.log("Login Failed!", error);
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
