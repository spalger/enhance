import component from 'lib/component'
import UserActions from 'actions/UserActions'
import UserStore from 'stores/UserStore'

export default component({
  afterMount() {
    this.bindTo(UserStore, 'user')
  },

  render(props, state) {
    var {user} = state
    var {requestLogin, requestLogout} = UserActions
    var {button, div, img} = this.dom

    if (!user) {
      return div(
        button({ onClick: requestLogin }, 'Login with Github')
      )
    } else {
      return div(
        img({ src: user.profile.avatar_url, style: { 'width': '20px' } }),
        user.profile.name,
        button({ onClick: requestLogout }, 'Logout')
      );
    }
  }
})