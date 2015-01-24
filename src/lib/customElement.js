export default class Element {
  constructor(tagName, component) {
    var proto = Object.create(HTMLElement.prototype)

    proto.attachedCallback = function() {
      var shadow = this.createShadowRoot();

      if (component.render && typeof component.render === 'function') {
        component.render(shadow)
      } else if (typeof component === 'string') {
        var tmp = document.createElement('template');
        tmp.innerHTML = component;
        shadow.appendChild(tmp.content.firstChild);
      } else {
        throw new Error('content must be a string or an object with a render method');
      }
    }

    document.registerElement(tagName, { prototype: proto })
  }
}