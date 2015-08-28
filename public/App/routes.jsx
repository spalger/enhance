import React from 'react'
import { Route } from 'react-router'

import App from './App'
import About from './About'
import InboxContainer from './Inbox/InboxContainer'

export default (
  <Route handler={ App } name='home' path='/app/enhance'>
    <Route handler={ About } name='about' path='about'/>
    <Route handler={ InboxContainer } name='inbox' path='inbox'/>
  </Route>
)
