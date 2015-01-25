import _ from 'lodash'
import Reflux from 'reflux'

import config from 'config'
import github from 'lib/github'
import log from 'lib/log'
import PayloadActions from 'actions/PayloadActions'
import UserStore from 'stores/UserStore'
import UserActions from 'stores/UserStore'

var payloadId = config.payload.id;
var FILENAME = 'enhance.payload.json';

export default Reflux.createStore({
  listenables: PayloadActions,

  payload: [],

  onSync(payload) {
    // create payload for first time if no id in config
    return payloadId ? this._update(payload) : this._create(payload)
  },

  // get the gist raw url, then load the raw gist data
  onGet() {
    return this._getGistPayload()
    .then(this._getRaw)
    .then((payload) => {
      this.trigger(payload);
    })
    .catch((err) => {
      log.error('Failed to fetch payload data')
      throw err;
    })
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

  _create(payload) {
    if (!UserStore.isLoggedIn()) {
      return UserActions.requireLogin();
    }

    var gistBody = _.assign(
      this._basicGistObject(payload),
      { public: true }
    );

    return github
    .path(['gists'])
    .method('post')
    .scopes('gist')
    .body(gistBody)
    .then((res) => {
      log.success('Please add this payloadId to /src/config.js: ', res.body.id)
    })
    .catch((err) => {
      log.error('Error creating an issue', err)
    });
  },

  _update(fileContents) {
    if (!UserStore.isLoggedIn()) {
      return UserActions.requireLogin();
    }

    var gistBody = this._basicGistObject(fileContents);
    return github
    .path(['gists', payloadId])
    .method('patch')
    .scopes('gist')
    .body(gistBody)
    .then(() => {
      log.success('Updated payload');
    })
    .catch((err) => {
      log.error('Error creating an issue', err);
    });
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
