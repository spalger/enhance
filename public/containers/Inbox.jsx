import { bindAll, get } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

import propTypes from '../lib/propTypes'
import { getMessages, sendMessage } from '../actions'

import InboxUi from '../ui/InboxUi'

export default connect(
  state => ({
    messages: state.messages,
    page: parseInt(get(state, 'router.query.page', 1), 10),
  }),
  { getMessages, sendMessage }
)(
  React.createClass({
    displayName: 'InboxContainer',
    propTypes: {
      messages: propTypes.messages,

      page: propTypes.number.isRequired,
      getMessages: propTypes.action,
      sendMessage: propTypes.action,
    },

    componentWillMount() {
      this.refresh()
    },

    getPage() {
      return parseFloat(this.props.page) || 1
    },

    refresh() {
      this.props.getMessages({
        page: this.getPage(),
      })
    },

    send() {
      this.props.sendMessage({
        from: 'email@spalger.com',
        to: 'potus@us.gov',
        body: 'Hi sir, it\'s great to meet you',
      })
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
