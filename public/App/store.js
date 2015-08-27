import { createStore } from 'redux'
import Immutable from 'immutable'

export default createStore(
  (state = new Immutable.Map(), action) => {
    switch (action.type) {

    case 'SEND_BACON':
      return state
      break

    default:
      throw new Error(`unkown action type ${action.type}`)

    }
  }
)
