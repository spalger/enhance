import React from 'react'

import propTypes from '../propTypes'
import InboxZero from './InboxZero'
import MessageList from './MessageList'

export default React.createClass({
  displayName: 'Inbox',

  propTypes: {
    messages: propTypes.messages,
    sendEmail: propTypes.action,
  },

  render() {
    let messages = this.props.messages.size
      ? <MessageList messages={ this.props.messages } />
      : <InboxZero />

    return (
      <div>
        <h2>Inbox</h2>
        <button onClick={ this.props.sendEmail }>Give me MORE!</button>
        { messages }
      </div>
    )
  },

})
