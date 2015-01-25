import _ from 'lodash'
import moment from 'moment'
import Reflux from 'reflux'
import request from 'superagent'
import config from 'config'
import log from 'lib/log'
import Promise from 'bluebird'

import PayloadActions from 'actions/PayloadActions'
import UserStore from 'stores/UserStore'

var { apiUrl } = config.github;
var payloadId = config.payload.id;

export default Reflux.createStore({
  listenables: PayloadActions,

  payload : [],

  onSync(payload) {
    // create payload for first time if no id in config
    debugger
    var handler = payloadId ? this._update(payload) : this._create(payload)
  },

  onGet() {
    // get the gist raw url, then load the raw gist data
    return this._getGistPayload()
    .then(this._getFileObjectFromGistInfo)
    .then(this._getRaw)
    .then(this._parseBody)
    .then((body) => {
      this.trigger(body)
    })
    .catch(function () {
      log.error('Failed to parse payload data')
    })
  },

  _create(payload) {
    var token = UserStore.getGithubToken()
    if (! token) {
      return log.error('Login required')
    }

    request
    .post([ apiUrl, 'gists'] .join('/'))
    .send(this._basicGistObject(payload, 'create'))
    .set('Authorization', 'token ' + token) // required token
    .end((error, res) => {
      if (res && _.isEqual(res.status, 201)) {
        var parsed = this._parseBody(res)
        log.success('Please add this payloadId to /src/config.js: ', parsed.id)
      } else {
        log.error('Error creating an issue', error)
      }
    });
  },

  _parseBody(res) {
    if (res.body) {
      return res.body;
    }

    try {
      return JSON.parse(res.text)
    } catch (e) {
      log.error('Unable to parse response on update payload')
      throw e
    }
  },

  _basicGistObject(payload, type) {
    var gistObject = { files : {} }
    var filename = moment().format('MM-DD-YYYY-hh-mm-ss') + '_enhance.json'
    gistObject.files[filename] = { content : payload }

    if (_.isEqual(type, 'create')) {
      gistObject.public = true
    }

    return gistObject
  },

  _update(payload) {
    var token = UserStore.getGithubToken()
    if (! token) {
      return log.error('Login required')
    }

    var gistObject = this._basicGistObject(payload, 'update')

    this._getGistPayload()
    .then(this._getFileObjectFromGistInfo)
    .then(function (fileObject) {
      if (fileObject) {
        gistObject.files[fileObject.filename] = null // delete the old file if it exists
      }

      request
      .patch([ apiUrl, 'gists', payloadId].join('/'))
      .send(gistObject)
      .set('Authorization', 'token ' + token) // required token
      .end(function(error, res) {
        if (res && res.status === 200) {
          log.success('Updated payload')
        } else {
          log.error('Error creating an issue', error)
        }
      });
    })
  },

  _getFileObjectFromGistInfo(gistInfo) {
    try {
      return _.toArray(gistInfo.files).pop()
    } catch (e) {
      log.error('Unable to get old payload filename');
      throw e
    }
  },

  _getGistPayload() {
    var token = UserStore.getGithubToken()

    return new Promise((resolve, reject) => {
      request
        .get([ apiUrl, 'gists', payloadId].join('/'))
        .set('Authorization', 'token ' + token) // @ todo not required
        .end((error, res) => {
          if (res && res.status === 200) {
            return resolve(this._parseBody(res))
          } else {
            log.error('Error getting gist: ' + error);
            return reject(error)
          }
        });
    });
  },

  _getRaw(fileObject) {
    if (! fileObject) return

    return new Promise((resolve, reject) => {
      request
        .get(fileObject.raw_url)
        .end(function(error, raw) {
          if (raw) {
            return resolve(raw)
          } else {
            log.error('Error getting gist: ' + error)
            return reject(error)
          }
        });
    })
  }
})
