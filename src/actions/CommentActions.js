import Reflux from 'reflux'
import commentModel from 'models/commentModel'

var actions = {
  fetch: Reflux.createAction({ asyncResult: true }),
  create: Reflux.createAction({ asyncResult: true }),
  upvote: Reflux.createAction({ asyncResult: true }),
  downvote: Reflux.createAction({ asyncResult: true }),
  // 'commentAddSuccess',
  // 'getByIssue',
  // 'upvoteSuccess',
  // 'downvoteSuccess'
}

actions.fetch.listen(function (options) {
  this.promise(commentModel.fetch(options))
})

actions.create.listen(function (issueId, comment) {
  var res = github
  .method('post')
  .path(['repos', org, repo, 'issues', issueId, 'comments'])
  .body({ body: comment })
  .then(commentModel.add)

  this.promise(res)
})
