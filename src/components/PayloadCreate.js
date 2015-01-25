import ClickToActionExtension from 'lib/CustomExtension'
import PayloadActions from 'actions/PayloadActions'
// import PayloadStore from 'stores/PayloadStore'

class PayloadCreate extends ClickToActionExtension {
  execAction() {
    PayloadActions.generate();
  }
}

export default PayloadCreate