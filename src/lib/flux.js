import _ from 'lodash'
import {ListenerMethods} from 'reflux'

export default flux

function flux(Component) {
  _.assign(Component.prototype, ListenerMethods);

  Component.addHandler('beforeUnmount', function () {
    this.stopListeningToAll();
  });

  Component.prototype.bindTo = function (Store, prop) {
    var assign = (val) => {
      this.setState({
        [prop]: val
      })
    }

    this.listenTo(Store, assign, assign);
  }
}
