import _ from 'lodash'
import Reflux from 'reflux'
import Promise from 'bluebird'

import config from 'config'
import github from 'lib/github'
import log from 'lib/log'
import PayloadActions from 'actions/PayloadActions'
import UserStore from 'stores/UserStore'
import UserActions from 'stores/UserStore'

var payloadId = config.payload.id;

export default Reflux.createStore({
  listenables: PayloadActions,

  payload : [],

  onSync(payload) {
    // create payload for first time if no id in config
    return payloadId ? this._update(payload) : this._create(payload)
  },

  onGet() {
    // get the gist raw url, then load the raw gist data
    return this._getGistPayload()
    .then(this._getRaw)
    .then(this.trigger)
    .catch(function () {
      log.error('Failed to parse payload data')
    })
  },

  _basicGistObject(payload) {
    return {
      files: {
        'enhance.payload.json': {
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
    .path([ 'gists'])
    .method('post')
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
    .body(gistBody)
    .then(function() {
      log.success('Updated payload');
    })
    .catch(function (err) {
      log.error('Error creating an issue', err);
    });
  },

  _getGistPayload() {
    return new Promise((resolve, reject) => {
      github
      .path(['gists', payloadId])
      .catch(function (err) {
        log.error('Error getting gist:', err);
        return reject(err)
      })
    });
  },

  _getRaw(fileObject) {
    return new Promise((resolve, reject) => {
      if (!fileObject) return

      return github
      .path(fileObject.raw_url)
      .auth(false)
      .catch(function (err) {
        reject(err)
        log.error('Error getting gist:', err)
      });
    })
  }
})
