import _ from 'lodash'
import {ListenerMethods} from 'reflux'

export default flux

function flux(Component) {
  _.assign(Component.prototype, ListenerMethods);
}
