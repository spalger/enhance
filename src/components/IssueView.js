import component from 'lib/component'
import _ from 'lodash'

import IssueStore from 'stores/IssueStore'
import CommentStore from 'stores/CommentStore'
import UserStore from 'stores/UserStore'
import RequestStore from 'stores/RequestStore'

import IssueActions from 'actions/IssueActions'
import CommentActions from 'actions/CommentActions'

import marked from 'lib/marked'

import log from 'lib/log'

export default component({
  initialState() {
    return {
      route: null,
      issue: null,
      comments: null,
      user: UserStore.user,
      newComment: '' // new user comment from textarea
    };
  },

  afterMount() {
    this.listenTo(CommentActions.commentAddSuccess, this.rerenderView)
    this.listenTo(CommentActions.upvoteSuccess, this.rerenderView)
    this.listenTo(CommentActions.downvoteSuccess, this.rerenderView)
    this.listenTo(RequestStore, _.noop, this.routeUpdated)
    this.bindTo(IssueStore, 'issue')
    this.bindTo(CommentStore, 'comments')
    log.msg('@TODO load issues -- IssueList.js')
  },

  routeUpdated(route) {
    IssueActions.fetchById(route.params.id)
    CommentActions.getByIssue(route.params.id)
  },

  // comment just posted by user
  rerenderView(issueNumber) {
    this.setState({ newComment: '', comments: null })
    CommentActions.getByIssue(issueNumber)
  },

  _renderFacepile() {

  },

  _renderUserComment() {

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
          div({class: 'comment-text' }, marked.parse(comment.body))
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

    return (
      div({class: 'comment-media media'},
        image,
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

  render(props, state) {
    var {div, ul, li, span, h1, h3, h4, h5, a, img, i, small, p} = this.dom
    var { issue, comments, user } = state

    // deps
    if (! issue) {
      return div('Loading...');
    }

    return div({class: 'container'},
      div({class: 'row'},
        div({class: 'col-xs-12 col-sm-12-col-lg-10 col-lg-offset-1'},
          div({class: 'issue-header-wrapper'},
            div({class: 'arrow-box'},
              a({class: 'big-vote text-g'},
                i({class: 'fa fa-caret-up', onClick: this.upvote.bind(null, state)})
              ),
              a({class: 'big-vote down text-g'},
                i({class: 'fa fa-caret-down', onClick: this.downvote.bind(null, state)})
              )
            ),
            div({class:'vote-box'},
              div({class: 'net-vote bold text-success'}, '100'),
              div({class: 'vote-summary-wrapper'},
                span({class: 'text-success float-left'},
                  small(
                    i({class: 'fa fa-plus'})
                  ),
                  span({class: 'bold'}, '100')
                ),
                span({class: 'text-success float-danger'},
                  small(
                    i({class: 'fa fa-minus'})
                  ),
                  span({class: 'bold'}, '100')
                )
              )
            ),
            div({class: 'issue-detail-box'},
              h1({class: 'detailed-issue-title bold italic'},
                a({class: 'text-success', href: issue.url},
                  i({class: 'fa fa-github'})
                ),
                ' ' + issue.title
              ),
              h3({class: 'italic text-gl'}, '#' + issue.number)
            )
          ),
          div({class: 'participant-wrapper'},
            h5({class: 'bold italic text-success'}, '+1`ers'),
            div({class: 'facepile-container'},
              a(
                img({alt: 'elvarb', class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/6923044?v=3&amp;s=80'})
              ),
              a(
                img({alt: 'elvarb', class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/471821?v=3&amp;s=80'})
              ),
              a(
                img({alt: 'elvarb', class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/322834?v=3&amp;s=80'})
              ),
              a(
                img({alt: 'elvarb', class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/6923044?v=3&amp;s=80'})
              ),
              a(
                img({alt: 'elvarb', class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/6923044?v=3&amp;s=80'})
              ),
              a(
                img({alt: 'elvarb', class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/6923044?v=3&amp;s=80'})
              ),
              a(
                img({alt: 'elvarb', class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/6923044?v=3&amp;s=80'})
              )
            )
          ),
          div({class: 'participants-wrapper'},
            h5({class: 'bold italic text-danger'}, '-1`ers'),
            div({class: 'facepile-container'},
              a(
                img({alt: 'elvarb', class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/6923044?v=3&amp;s=80'})
              ),
              a(
                img({alt: 'elvarb', class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/471821?v=3&amp;s=80'})
              )
            )
          )
        ),
        div({class: 'description-wrapper'},
          p({class: 'lead text-gl'}, issue.body)
        ),
        div({class: 'comment-wrapper'},
          div({class: 'comment-toolbar'},
            ul({class: 'tool-list'},
              li(
                a( { onClick : this.submitComment.bind(null, state) },
                  i({class: 'fa fa-plus'}, ' Add Comment')
                )
              )
            )
          ),
          this.renderTextbox(this.dom, user, state),
          this.renderComments(this.dom, comments),
          div({class: 'user-vote-action-wrapper'},
            span({class: 'user-image-wrapper'},
              a(
                img({class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/885279?v=3&amp;s=64'})
              ),
              a(
                img({class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/939704?v=3&amp;s=80'})
              )
            ),
            span({class: 'action'}, '+1`ed')
          ),
          div({class: 'user-vote-action-wrapper'},
            span({class: 'user-image-wrapper'},
              a(
                img({class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/885279?v=3&amp;s=80'})
              ),
              a(
                img({class: 'profile-image', src: 'https://avatars3.githubusercontent.com/u/939704?v=3&amp;s=80'})
              )
            ),
            span({class: 'action'}, '-1`ed')
          ),
          div({class: 'media'},
            div({class: 'media-left'},
              a(
                img({class: 'media-object', src: 'https://avatars3.githubusercontent.com/u/885279?v=3&amp;s=64'})
              )
            ),
            div({class: 'media-body'},
              h4({class: 'media-heading'},
                a({class: 'username bold text-g'}, '@username')
              ),
              p({class: 'comment-text'}, 'Things and stuff')
            )
          )
        )
      )
    )
  }
})