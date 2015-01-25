class CustomExtension extends HTMLElement {
  static register(baseTag, tagName) {
    return document.registerElement(tagName, {
      prototype: this.prototype,
      extends: baseTag
    });
  }
}
export default CustomExtension