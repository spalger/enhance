import { createStore } from 'redux'
import { Map as IMap, List, fromJS } from 'immutable'
import { compose, applyMiddleware } from 'redux'
import { handleActions } from 'redux-actions'
import { devTools, persistState } from 'redux-devtools'
import promiseMiddleware from 'redux-promise'

import inboxActions from './Inbox/actions'

const finalCreateStore = compose(
  // Enables your middleware:
  applyMiddleware(promiseMiddleware),

  // Provides support for DevTools:
  devTools(),

  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(
    window.location.href.match(/[?&]debug_session=([^&]+)\b/)
  ),

  createStore,
)

export default finalCreateStore(
  handleActions(
    {
      SEND_EMAIL: (state, actions) => {
        return state.set('messages',
          state
          .get('messages')
          .push(new IMap({
            id: `message_${state.get('messages').size + 1}`,
            from: 'john@email.com',
            body: 'BACON!!!',
          }))
        )
      },
    },
    fromJS({
      messages: new List(),
    })
  )
)
