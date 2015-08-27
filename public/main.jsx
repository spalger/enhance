import React from 'react'
import Router, { HistoryLocation } from 'react-router'
import routes from './App/routes'

require('ui/chrome')
.setNavBackground('#f5f5f5')
.setBrand({ title: 'app' })
.setRootTemplate('<div id="app-container"></div>')
.setRootController(() => setImmediate(() => {

  Router.run(routes, HistoryLocation, (Root) => React.render(
    <Root />,
    document.getElementById('app-container')
  ))

}))
