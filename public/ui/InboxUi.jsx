import { times } from 'lodash'
import React from 'react'
import { Link } from 'react-router'

import propTypes from '../lib/propTypes'
import MessageList from './MessageList'

export default React.createClass({
  displayName: 'InboxUi',

  propTypes: {
    messages: propTypes.messages,
    page: propTypes.number,
    refresh: propTypes.action,
  },

  render() {
    return (
      <div>
        <h2>Messages (page { this.props.page })</h2>
        <button onClick={ this.props.refresh }>Sync</button>
        <MessageList messages={ this.props.messages } />
        <ul>
          {
            times(5, page => {
              page += 1
              return (
                <li key={page}>
                  <Link to={`/app/enhance/inbox?page=${page}`}>{ page }</Link>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  },

})
