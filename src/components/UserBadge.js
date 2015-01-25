import component from 'lib/component'
import UserActions from 'actions/UserActions'
import UserStore from 'stores/UserStore'

export default component({
  beforeMount() {
    this.bindTo(UserStore, 'user')
  },

  render(props, state) {
    var {user} = state
    var {requestLogin} = UserActions
    var {a, span, img, i} = this.dom

    if (!user) {
      return a({class: 'bold', onClick : requestLogin },
        i({class: 'fa fa-github'}),
        span({class: 'hidden-xs'}, ' Login')
      )
    } else {
      return a({ href: user.profile.html_url },
        span({ class: 'header-profile-image'},
          img({ src: user.profile.avatar_url })
        ),
        span({ class: 'header-user-name bold'}, ' ' + user.profile.name)
      );
    }
  }
})