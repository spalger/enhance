import component from 'lib/component'
import marked from 'lib/marked'
import github from 'lib/github'

const TAG_RE = /\:([a-z0-9_\-\+]+)\:/g
export default component({
  afterMount(el, props) {
    github.emoji.then(function (resp) {
      var urls = resp.body
      var html = marked.parse(props.markdown)
      var withEmotion = html.replace(TAG_RE, function (match, name) {
        var url = urls[name]
        if (!url) return match
        var html = `<img class="emoji" title="${name}" alt="${name}" src="${url}"
            height="20" width="20" align="absmiddle">`
        return html;
      });

      var scriptTag = `<script src="markdown-${props.style || 'comment'}.js"></script>\n`;
      el.createShadowRoot().innerHTML = scriptTag + withEmotion;
    })
  },

  render() {
    return this.dom.div()
  }
});