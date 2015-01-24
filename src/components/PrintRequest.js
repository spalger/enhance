import _ from 'lodash'

import component from 'lib/component'
import RequestStore from 'stores/RequestStore'

export default component({
  afterMount() {
    this.bindTo(RequestStore, 'route')
  },

  render(props, state) {
    var {pre, div} = this.dom

    if (!state.route) {
      return div('null');
    }

    return pre(JSON.stringify(
      _.pick(state.route, 'matched', 'route', 'match', 'params'),
      null,
      '  '
    ));
  }
})