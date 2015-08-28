import React from 'react'
import { isEmpty } from 'lodash'

import propTypes from '../lib/propTypes'

export default React.createClass({
  displayName: 'Inbox',

  propTypes: {
    messages: propTypes.messages,
  },

  render() {
    if (isEmpty(this.props.messages)) {
      return (
        <div>
          <p>No Messages, good job!</p>
        </div>
      )
    }

    return (
      <div>
        <h2>MessageList</h2>
        {
          this.props.messages.map(message => {
            return (
              <li key={ message.id }>
                <h3>{ message.from }</h3>
                <p>{ message.body }</p>
              </li>
            )
          })
        }
      </div>
    )
  },

})
