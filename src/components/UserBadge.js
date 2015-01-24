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
    var {div, button, span, img} = this.dom
    var content
    if (!user) {
      content = button({ onClick: requestLogin }, 'Login with Github')
    } else {
      content = span(
        img({ src: user.profile.avatar_url }),
        user.profile.name,
        button({ onClick: requestLogout }, 'Logout')
      );
    }
    return div(content)
  }
})