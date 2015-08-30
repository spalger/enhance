import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import { history } from 'react-router/lib/BrowserHistory'
import { reduxRouteComponent } from 'redux-react-router'

import AppContainer from './App'
import AboutContainer from './About'
import InboxContainer from './Inbox'

import createStore from '../store/create'
const store = createStore()
const RouteComponent = reduxRouteComponent(store)

export default (
  <Router history={history}>
    <Route component={RouteComponent}>
      <Route path='/app/enhance' component={AppContainer}>
        <Route path='about' component={AboutContainer} />
        <Route path='inbox' component={InboxContainer} />
      </Route>
    </Route>
  </Router>
)
