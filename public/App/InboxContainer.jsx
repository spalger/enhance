import { connect } from 'react-redux'

import Inbox from './Inbox'

// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
  return { statemessages as messages }
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
  return {
    onIncrement: () => dispatch(increment())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)
