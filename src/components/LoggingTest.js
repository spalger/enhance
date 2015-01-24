import _ from 'lodash'
import component from 'lib/component'
import log from 'lib/log'

export default component({
  constructor() {
    this.logFns = _.mapValues(log, (fn, name) => {
      return _.bindKey(this, 'log', name)
    })
  },

  log(method) {
    log[method](this.ref('message', 'value'))
  },

  render() {
    var {div, h1, input, button, br} = this.dom
    var {logFns} = this

    return div(
      h1('Test Logging'),
      input({ ref: 'message' }),
      br(),
      _.map(logFns, function (fn, name) {
        return button({ onClick: fn }, name)
      })
    )
  }
})