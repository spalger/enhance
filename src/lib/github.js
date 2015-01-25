import _ from 'lodash'
import request from 'superagent'

import UserActions from 'actions/UserActions'
import UserStore from 'stores/UserStore'
import log from 'lib/log'
import Promise from 'bluebird'

import config from 'config'

var UNAUTHORIZED = 401
var NOT_FOUND = 404

function PartialReq(prev, next) {
  this.params = _.merge({
    // method: 'get'
  }, prev, next)
}

/**
 * Creates a simple fluent param setter
 *
 * @param  {String} prop - property name on this.params to set
 * @param  {Function} [mod] - optional modifier function
 * @return {Function} - the setter
 */
function setter(prop, mod) {
  return function (val) {
    return new PartialReq(this.params, {
      [prop]: mod ? mod(val) : val
    })
  }
}

PartialReq.prototype.query = setter('query')
PartialReq.prototype.body = setter('body')
PartialReq.prototype.scopes = setter('scopes')
PartialReq.prototype.auth = setter('auth')

PartialReq.prototype.method = setter('method', function (val) {
  return String(val).toUpperCase()
})

PartialReq.prototype.path = setter('path', function (val) {
  if (!_.isArray(val)) {
    val = val.split('/').filter(Boolean)
  }
  return val.map(encodeURIComponent).join('/')
})


PartialReq.prototype._getReq = function () {
  var {method, query, path, body, auth} = this.params
  var url = config.github.apiUrl + '/' + path

  var req = request(method, url)
  if (query) req.query(query)
  if (body) req.send(body)

  if (auth !== false) {
    let token = UserStore.getGithubToken()
    if (token) req.set('Authorization', 'token ' + token)
  }

  return req
}

PartialReq.prototype.then = function (thenback, errback) {
  return this.send().then(thenback, errback);
}

PartialReq.prototype.send = function () {
  var attempt = () => {
    return new Promise((resolve, reject) => {
      var req = this._getReq()

      req.end((err, resp) => {
        if (err) return reject(err)

        switch (resp && resp.status) {
        case UNAUTHORIZED:
        case NOT_FOUND:
          if (UserStore.isLoggedIn()) {
            return reject(new NeedsLogin(req, resp))
          }

          return reject(new NeedsPermission(req, resp))
        default:
          if (!resp || resp.status >= 300 || resp.status < 200) {
            return reject(new InvalidResponse(req, resp))
          }

          return resolve(resp)
        }
      })
    })
  }

  var split = (str) => {
    return str.split(',').map((scope) => {
      return scope.trim()
    })
  }

  var requestPermission = (err) => {
    var subs
    return new Promise((resolve, reject) => {

      var resp = err.resp
      var has = split(resp.headers['O-Auth-Scopes'])
      var needs = split(resp.headers['X-Accepted-OAuth-Scopes'])
      UserActions.requestPermission(has, needs)

      subs = [
        this.listenTo(UserActions.loginFailure, () => {
          log.error('unable to complete request without scopes ' + needs.join(', '))
          reject(err)
        }),

        this.listenTo(UserActions.loginSuccess, () => {
          resolve(attempt())
        })
      ]
    })
    .finally(() => {
      _.invoke(subs, 'stop')
    })
  }

  return attempt()
  .catch(NeedsPermission, requestPermission)
  .catch(NeedsLogin, UserActions.requireLogin)
  .catch(InvalidResponse, log.error)
}

class FailedResp extends Error {
  constructor(req, resp) {
    super()
    this.req = req
    this.resp = resp
  }
}

class NeedsLogin extends FailedResp {}
class NeedsPermission extends FailedResp {}
class InvalidResponse extends FailedResp {}

export default new PartialReq()