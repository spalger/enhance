import Reflux from 'reflux'
import Promise from 'bluebird'
import issueModel from 'models/issueModel'
import github from 'lib/github'
import config from 'config'

var actions = {
  fetch: Reflux.createAction({ asyncResult: true }),
  fetchFromApi: Reflux.createAction({ asyncResult: true }),
}

actions.fetch.listen(function (options) {
  this.promise(issueModel.fetch(options))
})

actions.fetchFromApi.listen(function (options) {
  // TODO: loop through the counts, exhaust issues in the api
  var { org, repo, enhanceLabel } = config.github;
  options = _.defaults(options || {}, {
    labels: [ enhanceLabel ],
    per_page: this.defaultPerPage,
    sort: 'updated',
    direction: 'desc'
  })

  var chain = Promise.resolve()
  if (options.reset) {
    delete options.reset
    chain = issueModel.reset()
  }

  var res = chain.then(function () {
    return github
    .path(['repos', org, repo, 'issues'])
    .query(options)
    .then(function (issues) {
      // push results into issue model
      return issueModel.upsert(issues.body)
    })
  })
  // trigger the fetch action so listeners trigger
  .then(() => { actions.fetch() })

  this.promise(res)
})

export default actions