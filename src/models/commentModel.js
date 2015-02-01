import DBClass from 'models/_baseClass'

// create a lunr search object and when we get github issues, index into this
class IssueModel extends DBClass {
  constructor() {
    super('comments')

    // used to set and fetch records by id
    this.primaryKey = 'id'
  }
}

export default new IssueModel()