import _ from 'lodash'
import deku from 'deku'
import Markdown from 'Markdown'

import component from 'lib/component'
import router from 'lib/router'
import log from 'lib/log'
import uppercase from 'lib/uppercase'

import VoteControls from 'components/VoteControls'
import VoteFacepile from 'components/VoteFacepile'

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

  renderComments(dom, comments) {
    var {div, a, img, h4} = dom

    if (! comments) {
      return div('Loading...')
    } else if (! comments.length) {
      return div('')
    }

    return _.map(comments, function(comment) {
      return div({class: 'media'},
        div({class: 'media-left'},
          a(
            img({class: 'media-object', src: 'https://avatars3.githubusercontent.com/u/' + comment.user.id + '?v=3&amp;s=64'})
          )
        ),
        div({class: 'media-body'},
          h4({class: 'media-heading'},
            a({class: 'username bold text-g', href: comment.user.html_url},
              comment.user.login
            )
          ),
          div(
            { class: 'comment-text' },
            deku.dom(Markdown, { markdown: comment.body })
          )
        )
      )
    })
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

  renderTextbox(dom, user, state) {
    var {div, a, img, h4, textarea, button, span, i} = dom
    var { newComment } = state
    var image = span('');
    var username = user.profile && user.profile.name ? user.profile.name : 'Please login to comment'
    if(user) {
      image = a(
        img({class: 'media-object', src: 'https://avatars3.githubusercontent.com/u/' + user.github.id + '?v=3&amp;s=64'})
      );
    }

    var commentBoxClass = state.showCommentBox ? ' show-comment-box' : '';

    return (
      div({class: 'comment-media media' + commentBoxClass },
        div({class: 'media-left'}, image),
        div({class: 'media-body'},
          h4({class: 'media-heading'},
            a({class: 'username bold text-glr'}, username)
          ),
          textarea({class: 'form-control', onKeyUp: this.updateNewComment}, newComment),
          button(
            {class: 'btn btn-sm btn-success pull-right add-comment-button', onClick : this.submitComment.bind(null, state) },
            i({class: 'fa fa-plus'}, ' Comment')
          )
        )
      )
    )
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
            deku.dom(LoadingContent)
          )
        )
      )
    }

    return div({class: 'container detail-view'},
      div({class: 'row'},
        div({class: 'col-xs-12 col-sm-12 col-lg-10 col-lg-offset-1'},
          div({class: 'issue-header-wrapper'},
            deku.dom(VoteControls, { issue: this.state.issue })
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
        deku.dom(VoteFacepile, { issue: this.state.issue }),
        div({class: 'description-wrapper'},
          p({class: 'lead text-gl'},
            deku.dom(Markdown, { markdown: issue.body, style: 'description' })
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
          this.renderTextbox(this.dom, user, state),
          this.renderComments(this.dom, comments)
        )
      )
    )
  )
  }
})