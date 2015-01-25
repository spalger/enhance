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
    this.renderContent(this.initialContent);
  }

  renderContent(content) {
    if (_.isFunction(content) && _.isFunction(content.render)) {
      return this.renderAsComponent(content)
    }

    if (typeof content === 'string') {
      return this.renderAsHtml(content);
    }

    throw new Error('content must be a string or a function with a render method');
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

  cleanup() {
    if (this.dekuTree) {
      this.dekuTree.remove();
    }

    this.innerHTML = '';
  }

  detachedCallback() {
    this.cleanup();
  }
}

export default CustomElement