import { PropTypes } from 'react'
import Immutable from 'immutable'

export default {
  ...PropTypes,

  messages: PropTypes.instanceOf(Immutable.Set).isRequired,
  action: PropTypes.func.isRequired,
}
