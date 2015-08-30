import { createStore, combineReducers } from 'redux'
import { compose, applyMiddleware } from 'redux'
import { routerStateReducer } from 'redux-react-router'
import promiseMiddleware from 'redux-promise'

const finalCreateStore = compose(
  applyMiddleware(promiseMiddleware),
  createStore,
)

import messagesReducer from '../reducers/messages'

export default () => finalCreateStore(combineReducers({
  router: routerStateReducer,
  messages: messagesReducer,
}))
