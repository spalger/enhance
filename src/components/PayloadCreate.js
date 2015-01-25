import _ from 'lodash'
import log from 'lib/log'

import component from 'lib/component'
import IssueActions from 'actions/IssueActions'
// import IssueStore from 'stores/IssueStore'

import PayloadActions from 'actions/PayloadActions'
import PayloadStore from 'stores/PayloadStore'

export default component({
  afterMount() {
    this.listenTo(PayloadStore, function (payload) {
      log.msg('payload', payload)
    })
  },

  getPayload() {
    IssueActions.payload()
  },

  render() {
    var { div, button } = this.dom
    return div(
      button({ onClick: _.bindKey(PayloadActions, 'persist', '{ "key": "value" }')}, 'Create payload'),
      button({ onClick: _.bindKey(PayloadActions, 'get') }, 'Fetch payload')
    )
  }
})