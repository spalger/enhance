import component from 'lib/component'
import LogoutButton from 'components/LogoutButton'
import deku from 'deku'

export default component({
  render() {
    var {footer, div, ul, li, span, a} = this.dom


    return footer(
      div({class: 'container'},
        ul({class: 'footer-nav pull-right'},
          li(
            span({class: 'linkless'}, "Producto de Arizona:")
          ),
          li(
            a({class: 'footer-link ', href: "https://github.com/spenceralger", target: "_BLANK"}, 'spenceralger')
          ),
          li(
            a({class: 'footer-link ', href: "https://github.com/w33ble", target: "_BLANK"}, 'w33ble')
          ),
          li(
            a({class: 'footer-link ', href: "https://github.com/jwdotjs", target: "_BLANK" }, 'jwdotjs')
          ),
          li(
            a({class: 'footer-link ', href: "https://github.com/captainhurst", target: "_BLANK" }, 'captainhurst')
          )
        )
      )
    )
  }
})


