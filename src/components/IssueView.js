import _ from 'lodash'
import Markdown from 'Markdown'

import component from 'lib/component'
import router from 'lib/router'
import log from 'lib/log'
import uppercase from 'lib/uppercase'

import VoteControls from 'components/VoteControls'
import VoteFacepile from 'components/VoteFacepile'
import CommentInput from 'components/CommentInput'
import CommentItem from 'components/CommentItem'

import RequestStore from 'stores/RequestStore'
import LoadingContent from 'LoadingContent'
import UserStore from 'stores/UserStore'
import IssueStore from 'stores/IssueStore'
import issueModel from 'models/issueModel'
import CommentActions from 'actions/CommentActions'
import CommentStore from 'stores/CommentStore'

export default component({
  initialState() {
    return {
      route: null,
      issue: null,
      comments: null,
      upvotes : [],
      downvotes : [],
      user: UserStore.user,
      newComment: '', // new user comment from textarea
      showCommentBox : false
    };
  },

  beforeMount() {
    this.listenTo(CommentActions.commentAddSuccess, this.rerenderView)
    this.listenTo(CommentActions.upvoteSuccess, this.rerenderView)
    this.listenTo(CommentActions.downvoteSuccess, this.rerenderView)

    // this.listenTo(IssueActions.fetchByIdFailed, router.goto.bind(null, '/'))
    this.listenTo(IssueStore, function(issues) {
      var issue = issues.filter
    })

    this.listenTo(RequestStore, _.noop, this.routeUpdated)
    this.bindTo(IssueStore, 'issue')
    this.listenTo(CommentStore, this.updateComments)
  },

  routeUpdated(route) {
    // IssueActions.fetchById(route.params.id)
    // CommentActions.getByIssue(route.params.id)
  },

  // comment just posted by user
  rerenderView(issueNumber) {
    this.setState({ newComment: '', comments: null })
    CommentActions.getByIssue(issueNumber)
  },

  updateNewComment(event) {
    this.setState({ newComment : event.target.value })
  },

  upvote(state) {
    CommentActions.upvote(state.issue.number);
  },

  downvote(state) {
    CommentActions.downvote(state.issue.number);
  },

  submitComment(state) {
    if (! state.newComment) {
      return log.error('Please enter text to leave a comment');
    }

    CommentActions.comment(state.issue.number, state.newComment);
  },

  toggleCommentBox(state) {
    this.setState({ showCommentBox : ! state.showCommentBox })
  },

  render(props, state) {
    var {div, ul, li, span, h1, h3, a, i, small, p} = this.dom
    var { issue, comments, user, upvotes, downvotes } = state

    // deps
    if (! issue) {
      return div({class: 'container'},
        div({class: 'row'},
          div({ class: 'col-xs-12 col-sm-12 col-lg-10 col-lg-offset-1'},
            this.el(LoadingContent)
          )
        )
      )
    }

    var commentBox = '';
    if (state.showCommentBox) {
      commentBox = this.el(CommentInput, { issueId: state.issue.id })
    }

    var issueComments = state.comments.map(function (comment) {
      return this.el(CommentItem, { comment })
    })

    return div({class: 'container detail-view'},
      div({class: 'row'},
        div({class: 'col-xs-12 col-sm-12 col-lg-10 col-lg-offset-1'},
          div({class: 'issue-header-wrapper'},
            this.el(VoteControls, { issue: state.issue })
            div({class:'vote-box'},
              div({class: 'net-vote bold text-success'}, upvotes.length - downvotes.length),
              div({class: 'vote-summary-wrapper'},
                span({class: 'text-success float-left'},
                  small(
                    i({class: 'fa fa-plus'})
                  ),
                  span({class: 'bold'}, upvotes.length)
                ),
                span({class: 'text-danger float-right'},
                  small(
                    i({class: 'fa fa-minus'})
                  ),
                  span({class: 'bold'}, downvotes.length)
                )
              )
            ),
            div({class: 'issue-detail-box'},
              h1({class: 'detailed-issue-title bold italic'},
                a({class: 'text-success', href: issue.html_url, target: '_blank'},
                  i({class: 'fa fa-github'})
                ),
                ' ' + issue.title
              ),
              h3({class: 'italic text-gl'}, '#' + issue.number),
              h3(
                span({class: 'italic text-gl'}, 'Status: '),
                span(uppercase(issue.state))
              )
            )
          ),
        this.el(VoteFacepile, { issue: state.issue }),
        div({class: 'description-wrapper'},
          p({class: 'lead text-gl'},
            this.el(Markdown, { markdown: issue.body, style: 'description' })
          )
        ),
        div({class: 'comment-wrapper'},
          div({class: 'comment-toolbar'},
            ul({class: 'tool-list'},
              li({ onClick: this.toggleCommentBox.bind(null, state) },
                a(
                  i({ class: 'fa fa-plus' }, ' Add Comment')
                )
              )
            )
          ),
          commentBox
          this.el(IssueAddComment, { issue: state.issue }),
          issueComments
        )
      )
    )
  )
  }
})