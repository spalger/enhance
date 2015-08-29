import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'

import AppContainer from './App'
import AboutContainer from './About'
import InboxContainer from './Inbox'

import storeProvider from '../app/store'

const store = storeProvider()

export default class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          {() =>
            <Router history={this.props.history}>
              <Route path='/app/enhance' component={AppContainer} />
              <Route path='/app/enhance/about' component={AboutContainer} />
              <Route path='/app/enhance/inbox' component={InboxContainer} />
            </Router>
          }
        </Provider>
      </div>
    )
  }
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
}
