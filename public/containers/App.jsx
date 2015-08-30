import React from 'react'
import { RouteHandler, Route, Link } from 'react-router'
import { Provider } from 'react-redux'

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
        <h1>Enhance</h1>
        <ul>
          <li><Link to='/app/enhance'>Home</Link></li>
          <li><Link to='/app/enhance/about'>About</Link></li>
          <li><Link to='/app/enhance/inbox'>Inbox</Link></li>
        </ul>
        { this.props.children }
      </div>
    )
  },

})
