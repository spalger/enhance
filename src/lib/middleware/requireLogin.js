import log from 'lib/log'
import Promise from 'bluebird'
import UserStore from 'stores/UserStore'
import UserActions from 'actions/UserActions'
import await from 'lib/await'

export default function requireLogin() {
  if (UserStore.isLoggedIn()) return Promise.resolve();

  UserActions.requireLogin()

  return await(UserActions.loginSuccess, UserActions.loginFailure)
  .then(function (listenable) {
    switch (listenable) {
    case UserActions.loginFailure:
      log.error('Login Required')
      throw new Error('Login Required')
      break;
    }
  });
}