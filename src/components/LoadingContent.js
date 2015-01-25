import component from 'lib/component'

export default component({
  render() {
    var {div, i} = this.dom

    return div({ class: 'loading-content' },
      i({ class: 'fa fa-spinner fa-spin'}),
      ' Loading Content...'
    )
  }
})