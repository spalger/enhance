import _ from 'lodash'

export default class Element {
  constructor(tagName, content) {
    var proto = Object.create(HTMLElement.prototype, {
      attachedCallback() {
        if (_.isFunction(content) && _.isFunction(content.render)) {
          return this.renderAsComponent(content)
        }

        if (typeof content === 'string') {
          return this.renderAsHtml(content);
        }

        throw new Error('content must be a string or an object with a render method');
      },

      renderAsComponent(Component) {
        var shadow = this.createShadowRoot();
        this.dekuTree = true;

        var attrs = _.transform(this.attributes, function (attrs, attr) {
          attrs[attr.name] = attr.value;
        }, {});

        this.scene = Component.render(shadow, attrs);
      },

      renderAsHtml(html) {
        var shadow = this.createShadowRoot()
        var tmp = document.createElement('template')
        tmp.innerHTML = html
        shadow.appendChild(tmp.content.firstChild)
      }
    })
    document.registerElement(tagName, { prototype: proto })
  }
}