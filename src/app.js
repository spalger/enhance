import _ from 'lodash'
import domready from 'domready'

import 'components/_registry_'
import 'pages/_registry_'

import CustomElement from 'lib/CustomElement'
import UserActions from 'actions/UserActions'
import {ListenerMethods} from 'reflux'
import router from 'lib/router'

class EnhanceApp extends CustomElement {
  attachedCallback() {
    domready(router.start)

    UserActions.listenTo()
  }
}

_.assign(EnhanceApp.prototype, ListenerMethods);

document.createElement('enhance-app', {
  prototype: Object.create(EnhanceApp.prototype)
})