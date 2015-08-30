import React from 'react'

export default React.createClass({
  displayName: 'Rui.Icon',

  propTypes: {
    name: React.PropTypes.string,
  },

  render() {
    return <i className={`fa fa-${this.props.name}`} />
  },
})
