import _ from 'lodash'
import deku from 'deku'
import multipleHandlers from 'deku-scrub/plugins/multipleHandlers'
import constructable from 'deku-scrub/plugins/constructable'
import withRefs from 'deku-scrub/plugins/withRefs'
import dom from 'deku-scrub/plugins/dom'

export default component

function component(spec) {
  var DekuComponent = deku.component(_.omit(spec, 'constructor'))

  // allow registering multiple handlers for initialState, beforeMount, etc.
  DekuComponent.use(multipleHandlers)

  // call the constructor before initialState
  DekuComponent.use(constructable(spec.constructor))

  // provide access to sub-elements
  DekuComponent.use(withRefs)

  // helpers for dom elements
  DekuComponent.use(dom)

  return DekuComponent
}

component.el = deku.dom
component.dom = dom

var use = deku.component().use;
component.is = function (any) {
  return (any && any.use === use);
}