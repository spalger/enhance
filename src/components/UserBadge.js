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
    var {button, span, img} = this.dom

    if (!user) {
      return button({ onClick: requestLogin }, 'Login with Github')
    } else {
      return span(
        img({ src: user.profile.avatar_url }),
        user.profile.name,
        button({ onClick: requestLogout }, 'Logout')
      );
    }
  }
})