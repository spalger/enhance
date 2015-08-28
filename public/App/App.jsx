import React from 'react'
import { RouteHandler, Route, Link } from 'react-router'
import { Provider } from 'react-redux'

import '../style/enhance.less'
import store from './store'

export default React.createClass({
  displayName: 'App',

  render() {
    return (
      <Provider store={store}>
      {() => (
        <div className='App'>
          <h1>Enhance</h1>
          <ul>
            <li><Link to='home'>Home</Link></li>
            <li><Link to='about'>About</Link></li>
            <li><Link to='inbox'>Inbox</Link></li>
          </ul>
          <RouteHandler/>
        </div>
      )}
      </Provider>
    )
  },

})
