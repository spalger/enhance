import component from 'lib/component'
import marked from 'lib/marked'
import github from 'lib/github'

import hljsDefaultStyles from 'highlight.js/styles/default.css'
import hljsGithubStyles from 'highlight.js/styles/github.css'

const TAG_RE = /\:([a-z0-9_\-\+]+)\:/g

const STYLES = `<style>${hljsDefaultStyles}\n${hljsGithubStyles}</style>`;

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

      el.createShadowRoot().innerHTML = STYLES + withEmotion;
    })
  },

  render(props) {
    return this.dom.div({ class: 'markdown markdown-' + (props.style || 'comment') })
  }
});