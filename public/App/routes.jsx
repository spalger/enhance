import React from 'react'
import { Route } from 'react-router'

import AppContainer from '../containers/App'
import AboutContainer from '../containers/About'
import InboxContainer from '../containers/Inbox'

export default (
  <Route handler={ AppContainer } name='home' path='/app/enhance'>
    <Route handler={ AboutContainer } name='about' path='about'/>
    <Route handler={ InboxContainer } name='inbox' path='inbox'/>
  </Route>
)
