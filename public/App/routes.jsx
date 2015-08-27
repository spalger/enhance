import React from 'react'
import { Route } from 'react-router'

import App from './App'
import About from './About'
import Inbox from './Inbox'

export default (
  <Route name='home' handler={ App } path='/app/enhance'>
    <Route name='about' handler={ About } path='about'/>
    <Route name='inbox' handler={ Inbox } path='inbox'/>
  </Route>
)
