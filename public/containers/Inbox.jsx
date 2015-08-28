import { connect } from 'react-redux'

import { sendEmail } from '../app/actions'
import InboxUi from '../ui/InboxUi'

export default connect(
  (state) => ({
    messages: state.messages,
  }),
  { sendEmail }
)(InboxUi)
