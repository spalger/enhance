import scrub from 'deku-scrub'

export default scrub({
  tagName: 'app-page',

  render() {
    var {div, h1} = this.dom
    return div(
      h1('static showdown 2015!')
    )
  }
})