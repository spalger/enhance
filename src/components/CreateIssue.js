import component from 'lib/component'
import config from 'config'

export default component({
  render() {
    var {div, a} = this.dom
    var { github } = config

    return div(
      a({ target: '_blank', href: [github.baseUrl, github.author, github.repo, 'issues', 'new'].join('/') },
        'Create Issue'
      )
    )
  }
})