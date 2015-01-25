import _ from 'lib/utils'
import Reflux from 'reflux'
import BallotActions from 'actions/BallotActions'
import ballotModel from 'models/ballotModel'
import config from 'config'
import github from 'lib/github'
import log from 'lib/log'

import PouchDB from 'pouchdb'
PouchDB.debug.disable('*');

export default Reflux.createStore({
  listenables: BallotActions,

  onSync() {
    var num = 1
    var count = 0;
    var per_page = 100 // max
    var {org, repo} = config.github
    var lastFetch = parseInt(localStorage.getItem('latest_comment_fetch'), 10);

    const PLUS_RE = /(\s|:)\+1/
    const MINUS_RE = /(\s|:)\-1/

    var maybeError = _.once(() => {
      log.error('There may have been an issue syncing comments from Github...');
    });

    var getPage = () => {
      return github
      .path(['repos', org, repo, 'issues', 'comments'])
      .query({
        page: num,
        per_page: per_page,
        since: isNaN(lastFetch) ? 0 : (new Date(lastFetch)).toISOString()
      })
      .then(function (resp) {
        return resp.body
      })
    }

    var consumePage = (page) => {
      return tallyVotes(page)
      .then(function () {
        return maybeNext(page);
      });
    }

    var maybeNext = (page) => {
      var size = _.size(page);
      count += size;
      if (size === per_page) {
        num++
        return getPage().then(consumePage);
      }
    }

    var tallyVotes = (page) => {
      return ballotModel.logVotes(_.transform(page, function (votes, comment) {
        var {user, issue_url, body} = comment;
        var userId = user.id
        var issueId = _.get(issue_url.match(/(\d+)$/), '1')

        if (!issueId) {
          maybeError();
          return;
        }

        var v = 0
        if (PLUS_RE.test(body)) v = +1
        else if (MINUS_RE.test(body)) v = -1

        var ballot = votes[issueId] || (votes[issueId] = {})
        ballot[userId] = v;
      }, {}))
    }

    return getPage().then(consumePage).then(function () {
      localStorage.setItem('latest_comment_fetch', Date.now())
      log.info('fetched', count, 'comments');
    })
  }
})
