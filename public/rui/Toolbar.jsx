import { omit, assign } from 'lodash'
import React, { PropTypes } from 'react'

import './rui.less'

let readOf = function (props) {
  return ('of' in props) ? props.of : 'div'
}

let comp = (Class, { wrap } = {}) => {
  let name = `RuiToolbar${Class || ''}`
  let innerName = `${name}Inner`

  return React.createClass({
    displayName: name,

    propTypes: {
      children: PropTypes.any,
      of: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.instanceOf(React.Component),
      ]),
    },

    render() {
      let childs = !wrap ? this.props.children : (
        <span className={innerName}>
          { this.props.children }
        </span>
      )

      return React.createElement(
        readOf(this.props),
        assign(omit(this.props, 'children', 'of'), { className: name }),
        childs
      )
    },
  })
}

const Toolbar = comp()
Toolbar.Brand = comp('Brand', { wrap: true })
Toolbar.Fill = comp('Fill')
Toolbar.Link = comp('Link', { wrap: true })

export default Toolbar
