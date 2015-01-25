import component from 'lib/component'
import UserActions from 'actions/UserActions'
import UserStore from 'stores/UserStore'

export default component({
  afterMount() {
    this.bindTo(UserStore, 'user')
  },

  render(props, state) {
    var {user} = state
    var {requestLogout} = UserActions
    var {a, span, i} = this.dom

    if (user) {
      return a({class: 'footer-link', onClick: requestLogout},
        i({class: 'fa fa-github'}),
        ' Logout'
      )
    } else {
      return span('',
        span('')
      )
    }
  }
})