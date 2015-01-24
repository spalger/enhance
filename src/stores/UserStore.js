import Reflux from 'reflux'
import UserActions from 'actions/UserActions'

export default Reflux.createStore({
  listenables: UserActions,

  onLogin: function () {

  },

  onLogout: function () {

  }
})
