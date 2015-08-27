import React from 'react'
import { RouteHandler, Route, Link } from 'react-router'
import '../style/enhance.less'

export default React.createClass({
  displayName: 'App',

  render() {
    return (
      <div className='App'>
        <h1>Enhance</h1>
        <ul>
          <li><Link to='home'>Home</Link></li>
          <li><Link to='about'>About</Link></li>
          <li><Link to='inbox'>Inbox</Link></li>
        </ul>
        <RouteHandler/>
      </div>
    )
  },

})
