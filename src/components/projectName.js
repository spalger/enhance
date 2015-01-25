import { github } from 'config'
import component from 'lib/component'

export default component({
  afterMount() {
    this.projectName = github.org + '/' + github.repo
  },

  render() {
    var { div } = this.dom
    div({ class: 'page-header' }, 'Browsing ' + this.projectName)
  }
})

