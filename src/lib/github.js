import _ from 'lodash'
import request from 'superagent'
import log from 'lib/log'
import UserActions from 'actions/UserActions'
import UserStore from 'stores/UserStore'
import Promise from 'bluebird'

import config from 'config'

var httpSuccessCodes = {
  get : 200,
  post : 201,
  patch : 200,
}

var UNAUTHORIZED = 401;

function ParameterizedReq(prev, next) {
  this.params = _.merge({
    // method: 'get'
  }, prev, next);
}

ParameterizedReq.prototype.path = setter('path', function (val) {
  if (!_.isArray(val)) {
    val = val.split('/').filter(Boolean);
  }
  return val.map(encodeURIComponent).join('/')
})
ParameterizedReq.prototype.query = setter('query')
ParameterizedReq.prototype.method = setter('method')
ParameterizedReq.prototype.scopes = setter('scopes')
ParameterizedReq.prototype.token = setter('token')
ParameterizedReq.prototype.send = send
ParameterizedReq.prototype.parseResponse = parseResponse

function setter(prop, mod) {
  mod = mod || _.identity
  return function (val) {
    return new ParameterizedReq(this.params, {
      [prop]: mod(val)
    })
  }
}

function send() {
  return new Promise((resolve, reject) => {
    function try() {
      var req = createRequestFromParams();

      req.end((error, response) => {
        if (response && _.isEqual(httpSuccessCodes[this.params.method], response.status)) {
          return resolve(response)
        } else if (_.isEqual(response.status, UNAUTHORIZED)) {
          var userSuccess = this.listenTo(UserAction.loginSuccess, try)
          this.listenTo(UserAction.loginFailure, this.stopListeningTo.bind(null, userSuccess))
          UserActions.requestLogin();
        } else {
          log.error(
            'A ' + response.status + ' error occurred while making a ' + this.params.method + ' Github request.'
          );
        }

        return reject();
      })
    }
  })
}

function createRequestFromParams() {
  var req = request(this.params.method, config.github.apiUrl + '/' + this.params.path)

  if (_.isEqual(this.params.method, 'get') && _.isEmpty(this.params.query)) {
    req.query(this.params.query)
  } else if (_.isEmpty(this.params.query)) {
    req.send(this.params.query)
  }

  if (this.params.token) {
    req.set('Authorization', 'token ' + this.params.token);
  }

  return req;
}

function parseResponse(response) {
  try {
    return JSON.parse(response);
  } catch (err) {
    log.error('Error parsing JSON from github lib');
  }
}

export default new ParameterizedReq();