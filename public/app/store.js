import { createStore } from 'redux'
import { compose, applyMiddleware } from 'redux'
import { handleActions } from 'redux-actions'

import { GET_MESSAGES, SEND_MESSAGE } from './actions'
import promiseMiddleware from 'redux-promise'

const finalCreateStore = compose(
  applyMiddleware(promiseMiddleware),
  createStore,
)

export default () => (
  finalCreateStore(
    handleActions(
      {
        [GET_MESSAGES]: (state, { payload }) => {
          return { ...state, messages: payload.messages }
        },

        [SEND_MESSAGE]: (state, { payload }) => {
          return {
            ...state,
            messages: [ ...state.messages, payload.message ],
          }
        },
      },
      {
        messages: [],
      }
    )
  )
)
