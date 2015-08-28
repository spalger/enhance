import React from 'react'
import { isEmpty } from 'lodash'

import propTypes from '../propTypes'
import InboxZero from './InboxZero'
import MessageList from './MessageList'

export default React.createClass({
  displayName: 'Inbox',

  propTypes: {
    messages: propTypes.messages,
    sendBacon: propTypes.action,
  },

  render() {
    let messages = isEmpty(this.props.messages)
      ? <InboxZero />
      : <MessageList messages={ this.props.messages } />

    return (
      <div>
        <h2>Inbox</h2>
        { messages }
        <button onClick={ this.props.sendBacon }>Give me MORE!</button>
      </div>
    )
  },

})
