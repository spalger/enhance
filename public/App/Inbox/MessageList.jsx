import React from 'react'

import propTypes from '../propTypes'

export default React.createClass({
  displayName: 'MessageList',

  propTypes: {
    messages: propTypes.messages,
  },

  render() {

    let messages = this.props.messages.map(message => {
      return (
        <li key={ message.get('id') }>
          <h3>{ message.get('from') }</h3>
          <p>{ message.get('body') }</p>
        </li>
      )
    })

    return (
      <div>
        <h2>MessageList</h2>
        { messages }
      </div>
    )
  },

})
