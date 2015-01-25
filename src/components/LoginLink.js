import ClickToActionExtension from 'lib/ClickToActionExtension'
import UserActions from 'actions/UserActions'

class LoginLink extends ClickToActionExtension {
  execActions() {
    UserActions.requestLogin();
  }
}

export default LoginLink