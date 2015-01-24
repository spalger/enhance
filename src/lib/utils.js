import _ from 'lodash'
import 'lodash-deep'

_.mixin({
  get: _.deepGet
})

export default _