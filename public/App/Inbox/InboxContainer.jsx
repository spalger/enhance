import { connect } from 'react-redux'

import { sendEmail } from './actions'
import Inbox from './Inbox'

export default connect(
  (state) => ({
    messages: state.get('messages'),
  }),
  { sendEmail }
)(Inbox)
