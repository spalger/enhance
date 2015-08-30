import React from 'react'
import Icon from 'rui/Icon'

export default React.createClass({
  displayName: 'LoginUi',

  render() {
    return (
      <div>
        <button className='btn-primary'>
          <Icon name='github'/> Login with Github
        </button>
      </div>
    )
  },

})
