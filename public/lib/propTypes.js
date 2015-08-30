import { PropTypes } from 'react'

export default {
  ...PropTypes,

  messages: PropTypes.array.isRequired,
  action: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  routeChildren: PropTypes.element.isRequired,
}
