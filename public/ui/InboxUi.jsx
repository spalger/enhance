import React from 'react'

import propTypes from '../lib/propTypes'
import MessageList from './MessageList'

export default React.createClass({
  displayName: 'InboxUi',

  propTypes: {
    messages: propTypes.messages,
    sendEmail: propTypes.action,
  },

  render() {
    return (
      <div>
        <h2>Inbox</h2>
        <button onClick={ this.props.sendEmail }>Give me MORE!</button>
        <MessageList messages={ this.props.messages } />
      </div>
    )
  },

})
