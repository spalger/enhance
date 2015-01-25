import _ from 'lodash'
import Reflux from 'reflux'

import config from 'config'
import github from 'lib/github'
import log from 'lib/log'

import PayloadActions from 'actions/PayloadActions'

import UserActions from 'actions/UserActions'
import UserStore from 'stores/UserStore'

import IssueStore from 'stores/IssueStore'

var payloadId = config.payload.id;
var FILENAME = 'enhance.payload.json';

export default Reflux.createStore({
  listenables: PayloadActions,

  payload: [],

  onGenerate() {
    var payload = IssueStore.onFetchAll()
    // .then((issues) => {
    //   // append comments using the ballot sync
    // })
    PayloadActions.generate.promise(payload)
  },

  onSave(payload) {
    // create payload for first time if no id in config
    PayloadActions.save.promise(payloadId ? this._update(payload) : this._create(payload))
  },

  // get the gist raw url, then load the raw gist data
  onGet() {
    var res = this._getGistPayload().then(this._getRaw)
    PayloadActions.get.promise(res)
  },

  onGetCompleted(payload) {
    this.trigger(payload)
  },

  _create(payload) {
    if (!UserStore.isLoggedIn()) {
      return UserActions.requireLogin();
    }

    var gistBody = _.assign(
      this._basicGistObject(payload),
      { public: true }
    );

    return github .method('post')
    .path(['gists'])
    .scopes('gist')
    .body(gistBody)
    .send()
  },

  _update(payload) {
    if (!UserStore.isLoggedIn()) {
      return UserActions.requireLogin();
    }

    var gistBody = this._basicGistObject(payload);

    return github .method('patch')
    .path(['gists', payloadId])
    .scopes('gist')
    .body(gistBody)
    .send()
  },

  _basicGistObject(payload) {
    return {
      files: {
        [FILENAME]: {
          content: payload
        }
      }
    }
  },

  _getGistPayload() {
    return github
    .path(['gists', payloadId])
    .send()
    .catch(function (err) {
      log.error('Error getting gist:', err);
      throw err;
    });
  },

  _getRaw(resp) {
    var file = resp.body.files[FILENAME];
    if (!file) {
      throw new Error(FILENAME + ' does not exist at gist ' + payloadId)
    }

    return github
    .url(resp.body.files[FILENAME].raw_url)
    .auth(false)
    .then(function (resp) {
      return resp.text;
    })
    .catch(function (err) {
      log.error('Error getting gist body:', err)
      throw err
    });
  }
})
