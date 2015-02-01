import _ from 'lodash'
import deku from 'deku'
import multipleHandlers from 'deku-scrub/plugins/multipleHandlers'
import constructable from 'deku-scrub/plugins/constructable'
import withRefs from 'deku-scrub/plugins/withRefs'
import dom from 'deku-scrub/plugins/dom'
import flux from 'lib/flux'

export default component

function component(spec) {
  var DekuComponent = deku.component(_.isFunction(spec) ? spec : _.omit(spec, 'constructor'));

  // allow registering multiple handlers for initialState, beforeMount, etc.
  DekuComponent.use(multipleHandlers)

  // call the constructor before initialState
  DekuComponent.use(constructable(spec.constructor))

  // provide access to sub-elements
  DekuComponent.use(withRefs)

  DekuComponent.use(flux)

  // helpers for dom elements
  DekuComponent.use(dom)

  DekuComponent.use(function (Component) {
    Component.prototype.el = deku.dom;

    Component.mount = function (...args) {
      args.unshift(Component);
      return deku.dom.apply(deku, args)
    }
  })

  return DekuComponent
}

component.dom = dom

var use = deku.component().use;
component.is = function (any) {
  return (any && any.use === use);
}