import Reflux from 'reflux'
import RouteActions from 'actions/RouteActions'

export default Reflux.createStore({
  listenables: RouteActions,

  req:{},

  getInitialState() {
    return this.req
  },

  onRequest(req) {
    this.trigger(this.req = req);
  }
})
