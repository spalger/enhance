import _ from 'lodash'
import component from 'lib/component'
import log from 'lib/log'

import IssueActions from 'actions/IssueActions'
import 'stores/IssueStore'

import CommentActions from 'actions/CommentActions'
import 'stores/CommentStore'

import UserActions from 'actions/UserActions'
import UserStore from 'stores/UserStore'

import PayloadActions from 'actions/PayloadActions'
import PayloadStore from 'stores/PayloadStore'

export default component({

  initialState() {
    return {
      user : {},
      comment : null
    }
  },

  afterMount() {
    this.listenTo(UserStore, _.bindKey(this, 'updateUser'), _.bindKey(this, 'updateUser'))
    this.listenTo(PayloadStore, function (payload) {
      log.msg('payload', payload)
    })
  },

  updateUser(user) {
    this.setState({ user })
  },

  handleComment(event) {
    this.setState({ comment : event.target.value })
  },

  _fetchIssues() {
    IssueActions.fetch()
  },

  render(props, state) {
    console.log(state.comment);
    var {div, h1, button, br, textarea} = this.dom

    return div(
      h1('static showdown 2015!'),
      button({ onClick : this._fetchIssues }, 'Load github issues'),
      button({ onClick : _.bindKey(CommentActions, 'getByIssue', 1) }, 'Load comments for issue 1'),
      button({ onClick : _.bindKey(CommentActions, 'upvote', 1) }, 'Upvote issue 1'),
      button({ onClick : _.bindKey(CommentActions, 'downvote', 1) }, 'Downvote issue 1'),
      button({ onClick : _.bindKey(IssueActions, 'create', 'Title', 'Body') }, 'Create issue'),
      br(),
      button({ onClick : UserActions.requestLogin }, 'Login with Github'),
      button({ onClick : UserActions.requestLogout }, 'Logout'),
      br(),
      br(),
      textarea({ onKeyUp : this.handleComment }),
      button({ onClick : _.bindKey(CommentActions, 'comment', 1, state.comment) }, 'Comment on issue 1'),

      button({ onClick : _.bindKey(PayloadActions, 'sync', '{ "key": "value" }')}, 'Sync payload'),
      button({ onClick : _.bindKey(PayloadActions, 'get') }, 'Get payload')

    )
  }
})