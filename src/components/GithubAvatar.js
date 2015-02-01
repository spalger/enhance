import component from 'lib/component'

const avatarUrl = 'https://avatars3.githubusercontent.com/u/'
const defaultSize = 64

export default component({
  render(props) {
    var { img } = this.dom

    var url = [avatarUrl, props.id, '?s=', props.size || defaultSize].join('')
    var alt = ['avatar-', props.id].join('')
    return img({ class: 'github-avatar', src: url, alt: alt })
  }
})