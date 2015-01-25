import component from 'lib/component'
import UserActions from 'actions/UserActions'
import UserStore from 'stores/UserStore'

export default component({
  afterMount() {
    this.bindTo(UserStore, 'user')
  },

  render(props, state) {
    var {user} = state
    var {requestLogin} = UserActions //requestLogout not used currently
    var {a, button, span, img} = this.dom

    if (!user) {
      return button({ onClick: requestLogin }, 'Login with Github')
    } else {
      return a( { href: '#'},
        span({ class: 'header-profile-image'},
          img({ src : user.profile.avatar_url })
        ),
        span({ class: 'header-user-name bold'}, user.profile.name)
      );
    }
  }
})