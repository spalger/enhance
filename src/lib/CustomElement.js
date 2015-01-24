import _ from 'lodash'

export default class View {
  constructor(tagName, content) {
    var proto = Object.create(HTMLElement.prototype);

    proto.attachedCallback = function () {
      if (_.isFunction(content) && _.isFunction(content.render)) {
        return this.renderAsComponent(content)
      }

      if (typeof content === 'string') {
        return this.renderAsHtml(content);
      }

      throw new Error('content must be a string or an object with a render method');
    }

    proto.detachedCallback = function () {
      if (this.dekuTree) {
        this.dekuTree.remove();
      }
    };

    proto.renderAsComponent = function (Component) {
      var shadow = this.createShadowRoot();

      var attrsDesc = _.toArray(this.attributes);
      var attrs = _.transform(attrsDesc, function (attrs, attr) {
        attrs[attr.name] = attr.value;
      }, {});

      this.dekuTree = Component.render(shadow, attrs);
    }

    proto.renderAsHtml = function (html) {
      var shadow = this.createShadowRoot()
      var tmp = document.createElement('template')
      tmp.innerHTML = html
      shadow.appendChild(tmp.content.firstChild)
    }

    document.registerElement(tagName, { prototype: proto })
  }
}