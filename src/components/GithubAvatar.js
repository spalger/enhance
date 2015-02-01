import component from 'lib/component'

const avatarUrl = 'https://avatars3.githubusercontent.com/u/'

export default component({
  beforeMount(props) {
    props.size = props.size || 64
  },

  render(props) {
    var { img } = this.dom

    var url = [avatarUrl, props.id, '?s=', props.size].join('')
    var alt = ['avatar-', props.id].join('')
    return img({ class: 'github-avatar', src: url, alt: alt })
  }
})