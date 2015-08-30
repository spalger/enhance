import { handleActions } from 'redux-actions'

import {
  GET_MESSAGES,
  SEND_MESSAGE
} from '../actions'

const defaultState = []


export default handleActions({

  [GET_MESSAGES]: (state, { payload }) => {
    return payload.messages
  },

  [SEND_MESSAGE]: (state, { payload }) => {
    return [ ...state, payload.message ]
  },

}, defaultState)
