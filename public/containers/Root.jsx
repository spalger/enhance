import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import { history } from 'react-router/lib/BrowserHistory'
import { reduxRouteComponent } from 'redux-react-router'

import AppContainer from './App'
import AboutContainer from './About'
import InboxContainer from './Inbox'
import LoginUi from '../ui/LoginUi'

import createStore from '../store/create'
import propTypes from '../lib/propTypes'

const store = createStore()
const RouteComponent = reduxRouteComponent(store)

export default React.createClass({
  displayName: 'Root',

  render() {
    return (
      <Router history={history}>
        <Route component={RouteComponent}>
          <Route path='/app/enhance' component={AppContainer}>
            <Route path='about' component={AboutContainer} />
            <Route path='inbox' component={InboxContainer} />
            <Route path='login' component={LoginUi} />
          </Route>
        </Route>
      </Router>
    )
  },

})
