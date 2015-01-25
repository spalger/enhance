import _ from 'lodash'

class CustomElement extends HTMLElement {
  static register(tagName, content) {
    return document.registerElement(tagName, {
      prototype: Object.create(CustomElement.prototype, {
        initialContent: {
          value: content
        }
      })
    });
  }

  attachedCallback() {
    var content = this.initialContent

    if (_.isFunction(content) && _.isFunction(content.render)) {
      return this.renderAsComponent(content)
    }

    if (typeof content === 'string') {
      return this.renderAsHtml(content);
    }

    throw new Error('content must be a string or a function with a render method');
  }

  detachedCallback() {
    this.cleanup();
  }

  cleanup() {
    if (this.dekuTree) {
      this.dekuTree.remove();
    }

    this.innerHTML = '';
  }

  renderAsComponent(Component) {
    this.cleanup();

    var attrsDesc = _.toArray(this.attributes);
    var attrs = _.transform(attrsDesc, function (attrs, attr) {
      attrs[attr.name] = attr.value;
    }, {});

    this.dekuTree = Component.render(this, attrs);
  }

  renderAsHtml(html) {
    this.cleanup();

    this.innerHTML = html;
  }
}

export default CustomElement