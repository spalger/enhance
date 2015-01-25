import component from 'lib/component'
import marked from 'lib/marked'
import github from 'lib/github'
import await from 'lib/await'
import UserActions from 'actions/UserActions'

const TAG_RE = /\:([a-z0-9_\-\+]+)\:/g;
const getUrls = await(UserActions.authUpdate).then(function () {
  return github.path('/emojis').then(function (resp) {
    return resp.body;
  });
});

export default component({
  afterMount(el, props) {
    getUrls.then(function (urls) {
      var html = marked.parse(props.markdown);
      var withEmotion = html.replace(TAG_RE, function (match, name) {
        var url = urls[name];
        if (!url) return match;
        return `<img class="emoji" title="${name}" alt="${name}" src="${url}" height="20" width="20" align="absmiddle">`
      });

      el.createShadowRoot().innerHTML = withEmotion;
    })
  },

  render() {
    return this.dom.div()
  }
});