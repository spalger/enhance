import component from 'lib/component'
import marked from 'lib/marked'
import github from 'lib/github'

const TAG_RE = /\:([a-z0-9_\-\+]+)\:/g;
const LINK_TAG = "<style> @import 'styles/markdown.css'; </style>"
export default component({
  afterMount(el, props) {
    github.emoji.then(function (urls) {
      var html = marked.parse(props.markdown);
      var withEmotion = html.replace(TAG_RE, function (match, name) {
        var url = urls[name];
        if (!url) return match;
        return `<img class="emoji" title="${name}" alt="${name}" src="${url}" height="20" width="20" align="absmiddle">`
      });

      el.createShadowRoot().innerHTML = LINK_TAG + "\n" + withEmotion;
    })
  },

  render() {
    return this.dom.div()
  }
});