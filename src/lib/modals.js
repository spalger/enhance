import _ from 'lodash'
import bootbox from 'bootbox'
import UserActions from 'actions/UserActions'
import await from 'lib/await'
import 'imports?jQuery=jquery!bootstrap/js/modal.js'

class Modal {
  constructor(opts) {
    this.opts = _.defaults({}, opts || {}, {
      title: 'Enhance',
      show: true,
      backdrop: true,
      closeButton: false,
      animate: true
    })
  }

  show() {
    var dialog = bootbox.dialog(this.opts);
    return await(this.opts.await)
    .finally(function () {
      dialog.modal('hide');
    });
  }
}

export const login = new Modal({
  message: require('modals/login.html'),
  await: [UserActions.loginSuccess, UserActions.loginFailure]
})