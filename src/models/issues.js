import lunr from 'lunr'

// create a lunr search object and when we get github issues, index into this
var issueIndex = lunr(function () {
  this.field('title', { boost: 10 })
  this.field('comments')
  this.ref('id')
})

export default issueIndex