import _ from 'lodash'
import DBClass from 'models/_baseClass'
import log from 'lib/log'

// create a lunr search object and when we get github issues, index into this
class BallotModel extends DBClass {
  constructor() {
    super('ballot')

    // used to set and fetch records by id
    this.primaryKey = 'issueId'
  }

  logVotes(votes) {
    var issueIds = _.keys(votes);

    return this.db.allDocs({
      include_docs: true,
      keys: issueIds
    })
    .then((batch) => {
      var savedById = _.transform(batch.rows, (byId, row) => {
        if (row.doc) byId[row.id] = row.doc;
      }, {});

      _.forOwn(votes, (update, issueId) => {
        var ballot = savedById[issueId];

        if (ballot) {
          _.merge(ballot.votes, update);
          return
        }

        savedById[issueId] = {
          _id: issueId,
          issueId: issueId,
          votes: update
        }
      });

      return this.db.bulkDocs(_.values(savedById));
    })
    .then(function (batchWrites) {
      var failed = _.filter(batchWrites, function (resp) {
        return !resp.ok;
      });

      if (!failed.length) return;

      log.error('failed to save', failed.length, 'comments');
    })
  }
}

export default new BallotModel()