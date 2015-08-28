import { PropTypes } from 'react'
import { List } from 'immutable'

export default {
  ...PropTypes,

  messages: PropTypes.instanceOf(List).isRequired,
  action: PropTypes.func.isRequired,
}
