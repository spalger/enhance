import React from 'react'
import ReactDOM from 'react-dom'

import Root from './containers/Root'

require('ui/modules')
.get('kibana')
.config(function ($provide) {
  // hack the $location service to stop it from breaking our router
  $provide.decorator('$location', function ($delegate) {
    $delegate.$$parseLinkUrl = function () {
      return false
    }

    return $delegate
  })
})

require('ui/chrome')
.setNavBackground('#f5f5f5')
.setBrand({ title: 'enhance' })
.setRootTemplate('<div id="enhance-container"></div>')
.setRootController(() => setImmediate(() => {
  ReactDOM.render(<Root />, document.getElementById('enhance-container'))
}))
