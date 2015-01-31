import Reflux from 'reflux'
import issueModel from 'models/issueModel'
import github from 'lib/github'
import config from 'config'

var actions = {
  fetch: Reflux.createAction({ asyncResult: true }),
}

actions.fetch.listen(function (options) {
  this.promise(issueModel.fetch(options))
})

export default actions