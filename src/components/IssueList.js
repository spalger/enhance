import component from 'lib/component'

export default component({
  render() {
    var {div, h1, ul, li} = this.dom

    return div(
      h1('Issue list'),
      ul(
        li('Issue #1'),
        li('Issue #2'),
        li('Issue #3'),
        li('Issue #4')
      )
    )
  }
})