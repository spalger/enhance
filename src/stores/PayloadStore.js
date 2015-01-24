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
var { payloadId } = config;

export default Reflux.createStore({
  listenables: PayloadActions,

  payload : [],

  _create(payload) {
    var token = UserStore.getGithubToken()
    if (! token) {
      return log.error('Login required');
    }

    request
      .post([ apiUrl, 'gists'] .join('/'))
      .send(this._basicGistObject(payload, 'create'))
      .set('Authorization', 'token ' + token) // required token
      .end((error, res) => {
        if (res && _.isEqual(res.status, 201)) {
          var parsed = this._parseResponse(res);
          if (parsed) {
            log.success('Please add this payloadId to /src/config.js: ', parsed.id);
          }
        } else {
          log.error('Error creating an issue', error);
        }
      });
  },

  _parseResponse(res) {
    try {
      return JSON.parse(res.text);
    } catch (e) {
      log.error('Unable to parse response on update payload');
    }
  },

  _basicGistObject(payload, type) {
    var gistObject = { files : {} }
    var filename = moment().format('MM-DD-YYYY-hh-mm-ss') + '_enhance.json'
    gistObject.files[filename] = { content : payload }

    if (_.isEqual(type, 'create')) {
      gistObject.public = true;
    }

    return gistObject;
  },

  _update(payload) {
    var token = UserStore.getGithubToken()
    if (! token) {
      return log.error('Login required');
    }

    var gistObject = this._basicGistObject(payload, 'update')

    this._getInfo()
    .then((gistInfo) => {
      var oldFile = this._getFileObjectFromGistInfo(gistInfo);
      if (oldFile) {
        gistObject.files[oldFile.filename] = null // delete the old file if it exists
      }

      request
        .patch([ apiUrl, 'gists', payloadId] .join('/'))
        .send(gistObject)
        .set('Authorization', 'token ' + token) // required token
        .end(function(error, res) {
          if (res && _.isEqual(res.status, 200)) {
            log.success('Updated payload')
          } else {
            log.error('Error creating an issue', error);
          }
        });
    })
  },

  onSync(payload) {
    // create payload for first time if no id in config
    return payloadId ? this._update(payload) : this._create(payload)
  },

  onGet() {
    // get the gist raw url, then load the raw gist data
    return this._getInfo()
    .then((gistInfo) => {
      var fileObject = this._getFileObjectFromGistInfo(gistInfo);

      if (fileObject) {
        return this._getRaw(fileObject)
        .then((rawGist) => {
          return rawGist;
        });
      }

      return;
    })
  },

  _getFileObjectFromGistInfo(gistInfo) {
    try {
      return _.toArray(gistInfo.files).pop()
    } catch (e) {
      log.error('Unable to get old payload filename');
    }
  },

  _getInfo() {
    var token = UserStore.getGithubToken()
    if (! payloadId) {
      log.msg('No payloadId specified in /src/config.js')
      return
    }

    return new Promise((res, rej) => {
      request
        .get([ apiUrl, 'gists', payloadId] .join('/'))
        .set('Authorization', 'token ' + token) // @ todo not required
        .end((error, response) => {
          if (error) {
            log.error('Error getting gist: ' + error);
          } else if (response) {
            var parsed = this._parseResponse(response);

            if (parsed) {
              log.success('Gist metadata fetched successfully');
              return res(parsed)
            }
          }
          return rej()
        });
    });
  },

  _getRaw(fileObject) {
    return new Promise((res, rej) => {
      request
        .get(fileObject.raw_url)
        .end(function(error, raw) {
          if (error) {
            log.error('Error getting gist: ' + error);
          } else if (raw) {
            log.success('Raw gist loaded');
            return res(raw)
          }
          return rej()
        });
    })
  }
})
