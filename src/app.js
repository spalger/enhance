import _ from 'lodash'
import domready from 'domready'

import 'components/_registry_'
import 'pages/_registry_'

import CustomElement from 'lib/CustomElement'
import UserActions from 'actions/UserActions'
import RequestStore from 'stores/RequestStore'
import log from 'lib/log'
import {ListenerMethods} from 'reflux'
import router from 'lib/router'

class EnhanceApp extends CustomElement {
  createdCallback() {
    domready(router.start)
  }

  attachedCallback() {
    this.listenTo(RequestStore, _.bindKey(this, 'renderRequest'))
    this.listenTo(UserActions.requestScopes, _.bindKey(this, 'onRequestScopes'))
    this.listenTo(UserActions.requireLogin, _.bindKey(this, 'onRequireLogin'))
  }

  renderRequest(req) {
    this.renderContent(req.route.template)
  }

  onRequireLogin() {
    log.error('You have to be logged in to do that.')
  }

  onRequestScopes(need) {
    log.info('asking for scopes', need)
  }
}

_.assign(EnhanceApp.prototype, ListenerMethods)

document.registerElement('enhance-app', {
  prototype: EnhanceApp.prototype
})