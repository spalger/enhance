import _ from 'lodash'
import domready from 'domready'

import 'styles/main.less'
import 'components/_registry_'
import 'pages/_registry_'

import CustomElement from 'lib/CustomElement'
import UserActions from 'actions/UserActions'
import RequestStore from 'stores/RequestStore'
import log from 'lib/log'
import {ListenerMethods} from 'reflux'
import router from 'lib/router'
import modals from 'lib/modals'

class EnhanceApp extends CustomElement {
  createdCallback() {
    this.listenTo(RequestStore, _.bindKey(this, 'renderRequest'))
    this.listenTo(UserActions.ready, _.bindKey(this, 'onUserStoreReady'))
    this.listenTo(UserActions.requireLogin, _.bindKey(this, 'onRequireLogin'))
    this.listenTo(UserActions.requestScopes, _.bindKey(this, 'onRequestScopes'))
  }

  renderRequest(req) {
    this.renderContent(req.route.template)
  }

  onUserStoreReady() {
    domready(router.start)
  }

  onRequireLogin() {
    modals.login.show()
  }

  onRequestScopes(need) {
    log.info('asking for scopes', need)
  }
}

_.assign(EnhanceApp.prototype, ListenerMethods)

document.registerElement('enhance-app', {
  prototype: EnhanceApp.prototype
})