import marked from 'marked'

import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'
import 'highlight.js/styles/github.css'

hljs.configure({
  tabReplace: '    ',
  useBR: true
});

function highlight(code, lang) {
  lang = hljs.getLanguage(lang) ? lang : false;

  if (lang) {
    return hljs.highlight(lang, code, true).value;
  } else {
    return '<pre><code>' + code + '</code></pre>';
  }
}

export const parse = function (string) {
  return marked(string, {
    gfm: true,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: highlight
  })
};