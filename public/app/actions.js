import { createAction } from 'redux-actions'
import { format as formatUrl } from 'url'

const APIPATH_MSG = '/api/enhance/messages'

export const GET_MESSAGES = 'GET_MESSAGES'
export const getMessages = createAction(GET_MESSAGES, async ({ page }) => {
  let url = formatUrl({
    pathname: APIPATH_MSG,
    query: {
      page: page || 1,
    },
  })

  let resp = await fetch(url)
  let messages = await resp.json()
  return { messages }
})

export const SEND_MESSAGE = 'SEND_MESSAGE'
export const sendMessage = createAction(SEND_MESSAGE, async (inputMessage) => {
  let url = APIPATH_MSG
  let method = 'post'
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  let body = JSON.stringify(inputMessage)

  let resp = await fetch(url, { method, body, headers })
  let message = await resp.json()
  return { message }
})
