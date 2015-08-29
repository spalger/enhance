import React from 'react'
import BrowserHistory from 'react-router/lib/BrowserHistory'

import Root from './containers/Root'

require('ui/chrome')
.setNavBackground('#f5f5f5')
.setBrand({ title: 'enhance' })
.setRootTemplate('<div id="enhance-container"></div>')
.setRootController(() => setImmediate(() => {

  React.render(
    <Root history={new BrowserHistory()} />,
    document.getElementById('enhance-container')
  )

}))
