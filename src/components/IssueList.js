import component from 'lib/component'

import RequestStore from 'stores/RequestStore'

export default component({
  initialState() {
    return {
      route: null
    };
  },

  afterMount() {
    this.bindTo(RequestStore, 'route')
  },

  render(props, state) {
    // deps
    if (!state.route) return;

    var {div, h1, ul, li} = this.dom

    return div(
      h1('Issue #' + state.route.params.id),
      ul(
        li('Issue #1'),
        li('Issue #2'),
        li('Issue #3'),
        li('Issue #4')
      )
    )
  }
})