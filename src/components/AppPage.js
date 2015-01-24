import component from 'lib/component'

export default component({
  render() {
    var {div, h1} = this.dom

    return div(
      h1('static showdown 2015!')
    )
  }
})