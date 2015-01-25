import ClickToActionExtension from 'lib/CustomExtension'
import UserActions from 'actions/UserActions'

class LoginLink extends ClickToActionExtension {
  execAction() {
    UserActions.requestLogin();
  }
}

export default LoginLink