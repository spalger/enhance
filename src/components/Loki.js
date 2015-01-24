import component from 'lib/component'

import loki from 'database/loki'

export default component({
  render(props, state) {
    var {div} = this.dom

    debugger // loki.db()

    return div('testing loki, look at console');
  }
})