import { github } from 'config'
import component from 'lib/component'

export default component({
  render() {
    var { span } = this.dom
    return span({ class: 'page-header browsing' }, ' Browsing ' + github.org + '/' + github.repo)
  }
})

