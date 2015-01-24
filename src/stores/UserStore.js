import Reflux from 'reflux'
import UserActions from 'actions/UserActions'
import Firebase from 'firebase/lib/firebase-web'

var ref = new Firebase("https://enhance.firebaseio.com");

export default Reflux.createStore({
  listenables: UserActions,

  getInitialState : function() {
    ref.onAuth((auth) => {
      if (auth=== null) {
        console.log('logged out');
      } else {
        this.trigger(auth);
        console.log("Authenticated successfully with payload:", auth);
      }
    })
  },

  onLogin: function () {
    ref.authWithOAuthPopup("github", function(error) {
      if (error) {
        console.log("Login Failed!", error);
      }
    });

  },

  onLogout: function () {
    ref.unauth();
  }
})
