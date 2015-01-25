
class ClickToActionExtension extends HTMLElement {
  static register(baseTag, tagName) {
    return document.registerElement(tagName, {
      prototype: this.prototype,
      extends: baseTag
    });
  }

  attachedCallback() {
    this.onClick = (event) => {
      if (this.execActions() !== false) {
        event.preventDefault();
      }
    };

    this.addEventListener('click', this.onClick);
  }

  detachedCallback() {
    this.removeEventListener('click', this.onClick)
  }
}

export default ClickToActionExtension