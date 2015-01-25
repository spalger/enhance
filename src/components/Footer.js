import component from 'lib/component'
import LogoutButton from 'components/LogoutButton'
import deku from 'deku'

export default component({
  render() {
    var {footer, div, ul, li} = this.dom


    return footer(
      div({class: 'container'},
        ul({class: 'footer-nav pull-right'},
          li(
            deku.dom(LogoutButton)
          )
        )
      )
    )
  }
})


