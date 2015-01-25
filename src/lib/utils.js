import _ from 'lodash'
import 'lodash-deep'

_.mixin({
  get: _.deepGet,
  exec: function (obj, method, ...args) {
    return function () {
      return obj[method].apply(obj, args);
    }
  }
})

export default _