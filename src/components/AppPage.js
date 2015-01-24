import _ from 'lodash'
import component from 'lib/component'

import IssueActions from 'actions/IssueActions'
import IssueStore from 'stores/IssueStore' // jshint ignore:line

import CommentActions from 'actions/CommentActions'
import CommentStore from 'stores/CommentStore' // jshint ignore:line

import UserActions from 'actions/UserActions'
import UserStore from 'stores/UserStore' // jshint ignore:line

export default component({
  tagName: 'app-page',

  initialState() {
    return {
      user : {},
      comment : null
    }
  },

  afterMount() {
    this.listenTo(UserStore, _.bindKey(this, 'updateUser'), _.bindKey(this, 'updateUser'))
  },

  updateUser(user) {
    this.setState({ user })
  },

  handleComment(event) {
    this.setState({ comment : event.target.value })
  },

  render(props, state) {
    console.log(state.comment);
    var {div, h1, button, br, textarea} = this.dom

    return div(
      h1('static showdown 2015!'),
      button({ onClick : _.bindKey(IssueActions, 'getAll') }, 'Load github issues'),
      button({ onClick : _.bindKey(CommentActions, 'getByIssue', 1) }, 'Load comments for issue 1'),
      button({ onClick : _.bindKey(CommentActions, 'upvote', 1) }, 'Upvote issue 1'),
      button({ onClick : _.bindKey(CommentActions, 'downvote', 1) }, 'Downvote issue 1'),
      button(
        { onClick : _.bindKey(IssueActions, 'create', 'Title', 'Body') },
        'Create issue'
      ),
      br(),
      button({ onClick : _.bindKey(UserActions, 'login') }, 'Login with Github'),
      button({ onClick : _.bindKey(UserActions, 'logout') }, 'Logout'),
      br(),
      br(),
      textarea({ onKeyUp : this.handleComment }),
      button({ onClick : _.bindKey(CommentActions, 'comment', 1, state.comment) }, 'Comment on issue 1')

    )
  }
})