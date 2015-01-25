// import _ from 'lodash'
// import log from 'lib/log'

// import component from 'lib/component'
// import IssueActions from 'actions/IssueActions'
// // import IssueStore from 'stores/IssueStore'

// import PayloadActions from 'actions/PayloadActions'
// import PayloadStore from 'stores/PayloadStore'

// export default component({
//   afterMount() {
//     this.listenTo(PayloadStore, function (payload) {
//       log.msg('payload', payload)
//     })
//     this.listenTo(PayloadActions.get.failed, function (err) {
//       log.error('Failed to load payload data', err)
//     })
//   },

//   persistPayload() {
//     var payload = IssueActions.fetchAll()

//   },

//   getPayload() {
//     PayloadActions.get()
//   },

//   render(props) {
//     var { div, button } = this.dom
//     return div(
//       button({ onClick: _.bindKey(PayloadActions, 'generate', '{ "key": "value" }')}, 'Create payload'),
//       button({ onClick: this.getPayload }, 'Fetch payload')
//     )
//   }
// })

import ClickToActionExtension from 'lib/CustomExtension'
import PayloadActions from 'actions/PayloadActions'
// import PayloadStore from 'stores/PayloadStore'

class PayloadCreate extends ClickToActionExtension {
  execAction() {
    PayloadActions.generate();
  }
}

export default PayloadCreate