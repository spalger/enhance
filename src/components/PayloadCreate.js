// import _ from 'lodash'

import component from 'lib/component'
import IssueActions from 'actions/IssueActions'
// import IssueStore from 'stores/IssueStore'

export default component({
  getPayload() {
    IssueActions.payload()
  },

  render() {
    var { p, button } = this.dom
    return p('payloadin',
      button({ onClick: this.getPayload }, 'pay the loads')
    )
  }
})