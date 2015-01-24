import _ from 'lodash'
import 'lodash-deep'

_.mixin({
  get: _.lodashDeep
})

export default _