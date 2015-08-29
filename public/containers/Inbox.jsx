import { bindAll } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

import propTypes from '../lib/propTypes'
import { getMessages, sendMessage } from '../app/actions'

import InboxUi from '../ui/InboxUi'

export default connect(
  state => ({ messages: state.messages })
)(
  React.createClass({
    displayName: 'InboxContainer',
    propTypes: {
      dispatch: propTypes.func.isRequired,
      location: propTypes.object.isRequired,
      messages: propTypes.messages,
    },

    componentWillMount() {
      this.refresh()
    },

    getPage() {
      let { query } = this.props.location
      return parseFloat(query.page) || 1
    },

    refresh() {
      this.props.dispatch(getMessages({
        page: this.getPage(),
      }))
    },

    send() {
      this.props.dispatch(sendMessage({
        from: 'email@spalger.com',
        to: 'potus@us.gov',
        body: 'Hi sir, it\'s great to meet you',
      }))
    },

    render() {
      return (
        <div>

          <button onClick={ this.send }>Send</button>

          <InboxUi
            page={this.getPage()}
            messages={this.props.messages}
            refresh={this.refresh}
          />

      </div>
      )
    },
  })
)
