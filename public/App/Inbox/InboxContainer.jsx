import { connect } from 'react-redux'

import { sendBacon } from './actions'
import Inbox from './Inbox'

export default connect(
  (state) => ({
    messages: state.get('messages'),
  }),
  { sendBacon }
)(Inbox)
