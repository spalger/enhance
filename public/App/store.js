import { createStore } from 'redux'
import { compose, applyMiddleware } from 'redux'
import { handleActions } from 'redux-actions'

import { SEND_EMAIL } from './actions'
import promiseMiddleware from 'redux-promise'

const finalCreateStore = compose(
  applyMiddleware(promiseMiddleware),
  createStore,
)

export default finalCreateStore(
  handleActions(
    {
      [SEND_EMAIL]: (state, actions) => {
        return {
          ...state,

          messages: [
            ...state.messages,

            {
              id: `message_${state.messages.length + 1}`,
              from: 'john@email.com',
              body: 'BACON!!!',
            },
          ],
        }
      },
    },
    {
      messages: [],
    }
  )
)
