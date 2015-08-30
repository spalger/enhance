import React from 'react'
import { Provider } from 'react-redux'
import { Link as RRLink } from 'react-router'

import Toolbar, { Brand, Link, Fill } from 'rui/Toolbar'

import '../style/enhance.less'
import propTypes from '../lib/propTypes'

export default React.createClass({
  displayName: 'App',

  propTypes: {
    children: propTypes.routeChildren,
  },

  render() {
    return (
      <div className='App'>
        <Toolbar>
          <Link of={RRLink} to='/app/enhance/about'>About</Link>
          <Link of={RRLink} to='/app/enhance/inbox'>Inbox</Link>
          <Fill />
          <Link of={RRLink} to='/app/enhance/login'>Login</Link>
        </Toolbar>
        { this.props.children }
      </div>
    )
  },

})
