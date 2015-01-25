import marked from 'marked'

export default {
  parse(string) {
    return marked(string, { gfm : true })
  }
}