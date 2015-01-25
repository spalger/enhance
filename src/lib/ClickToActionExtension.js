import CustomExtension from 'lib/CustomExtension'

class ClickToActionExtension extends CustomExtension {
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