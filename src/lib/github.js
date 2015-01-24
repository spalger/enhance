import _ from 'lodash'

function ParameterizedReq(prev, next) {
  this.params = _.merge({}, prev, next);
}

ParameterizedReq.prototype.path = setter('path')
ParameterizedReq.prototype.query = setter('query')
ParameterizedReq.prototype.method = setter('method')
ParameterizedReq.prototype.scopes = setter('scopes')
ParameterizedReq.prototype.headers = setter('headers')

function setter(prop) {
  return function (val) {
    return new ParameterizedReq(this.params, {
      [prop]: val
    })
  }
}

export const github = new ParameterizedReq();