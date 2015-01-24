import _ from 'lodash'
import Reflux from 'reflux'
import request from 'superagent'
import config from 'config'
import moment from 'moment'
import log from 'lib/log'

import PayloadActions from 'actions/PayloadActions'
import UserStore from 'stores/UserStore'

var { apiUrl } = config.github;
var { payloadId } = config;
var token = UserStore.getGithubToken()

export default Reflux.createStore({
  listenables: PayloadActions,

  payload : [],

  _create(payload, oldFile) {
    if (! token) {
      return log.error('Login required');
    }

    var gistObject = { public : true }
    var filename = moment().format('MM-DD-YYYY-hh-mm-ss_enhance.json')
    gistObject[filename] = payload

    if (oldFile) {
      gistObject[oldFile] = null // delete the old file if it exists
    }

    request
      .post([ apiUrl, 'gists'] .join('/'))
      .send(gistObject)
      .set('Authorization', 'token ' + token) // required token
      .end(function(error, res) {
        if (error) {
          log.error('Error creating an issue: ' + error);
        }

        if (res) {
          log.success('Please add this payloadId to /src/config.js: ', res.id);
          console.log(res); // @todo handle response
        }
      });
  },

  _update(payload) {
    if (! token) {
      return log.error('Login required');
    }

    this._getInfo(function(gistInfo) {
      var fileObject = this._getFileObjectFromGistInfo(gistInfo);
      this._create(payload, fileObject);

    })
  },

  onSync(payload) {
    // create payload for first time if no id in config
    return payloadId ? this._update(payload) : this._create(payload)
  },

  onGet() {
    // get the gist raw url, then load the raw gist data
    return this._getInfo(function(gistInfo) {
      var fileObject = this._getFileObjectFromGistInfo(gistInfo);

      if (fileObject) {
        return this._getRaw(fileObject, function(rawGist) {
          return rawGist;
        });
      }

      return;
    })
  },

  _getFileObjectFromGistInfo(gistInfo) {
    var fileObject = _.at(gistInfo.files, 0);
    if(! fileObject.length) {
      log.error('Unable to get raw gist url for payload');
    } else {
      fileObject = fileObject.pop();
    }
    return fileObject
  },

  _getInfo(callback) {
    if (! payloadId) {
      log.msg('No payloadId specified in /src/config.js')
      return
    }

    request
      .get([ apiUrl, 'gists', payloadId] .join('/'))
      .set('Authorization', 'token ' + token) // @ todo not required
      .end(function(error, res) {
        if (error) {
          log.error('Error getting gist: ' + error);
        } else if (res) {
          log.success('Gist metadata fetched successfully');
          callback(res);
        }

        callback();
      });
  },

  _getRaw(fileObject, callback) {
    request
      .get(fileObject.raw_url)
      .set('Authorization', 'token ' + token) // @ todo not required
      .end(function(error, res) {
        if (error) {
          log.error('Error getting gist: ' + error);
        } else if (res) {
          log.success('Raw gist loaded');
          callback(res)
        }
        callback()
      });
  }
})
