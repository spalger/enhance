import React from 'react'
import { RaisedButton, FontIcon } from 'material-ui-io'

import propTypes from '../lib/propTypes'

export default React.createClass({
  displayName: 'LoginUi',

  render() {
    return (
      <div>
        <RaisedButton primary label='Login with Github'>
          <FontIcon className='muidocs-icon-custom-github'/>
        </RaisedButton>
      </div>
    )
  },

})
