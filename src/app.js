import _ from 'lodash'
import domready from 'domready'

import 'components/_registry_'
import 'pages/_registry_'

import CustomElement from 'lib/CustomElement'
import RequestStore from 'stores/RequestStore'
import {ListenerMethods} from 'reflux'
import router from 'lib/router'

class EnhanceApp extends CustomElement {
  createdCallback() {
    domready(router.start)
  }

  attachedCallback() {
    this.listenTo(RequestStore, _.bindKey(this, 'renderRequest'))
  }

  renderRequest(req) {
    this.renderContent(req.route.template);
  }
}

_.assign(EnhanceApp.prototype, ListenerMethods);

document.registerElement('enhance-app', {
  prototype: EnhanceApp.prototype
})