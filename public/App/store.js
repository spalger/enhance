import { createStore } from 'redux'
import Immutable, { fromJS } from 'immutable'
import inboxActions from './Inbox/actions'

let defaultState = () => {
  return fromJS({
    messages: new Immutable.Set(),
  })
}

export default createStore(
  (state = defaultState(), action) => {
    switch (action.creator) {

    case inboxActions.sendBacon:
      let message = new Immutable.Map({
        time: Date.now(),
        from: 'john@email.com',
        body: 'BACON!!!',
      })

      let messages = state.get('messages').add(message)

      return state.set('messages', messages)

    default:
      return state

    }
  }
)
