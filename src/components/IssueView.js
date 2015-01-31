import component from 'lib/component'
import _ from 'lodash'
import deku from 'deku'

import IssueStore from 'stores/IssueStore'
import CommentStore from 'stores/CommentStore'
import UserStore from 'stores/UserStore'
import RequestStore from 'stores/RequestStore'
import router from 'lib/router'

import deku from 'deku'
import LoadingContent from 'LoadingContent'

import IssueActions from 'actions/IssueActions'
import CommentActions from 'actions/CommentActions'

import Markdown from 'Markdown'

import log from 'lib/log'
import uppercase from 'lib/uppercase'

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

  afterMount() {
    this.listenTo(CommentActions.commentAddSuccess, this.rerenderView)
    this.listenTo(CommentActions.upvoteSuccess, this.rerenderView)
    this.listenTo(CommentActions.downvoteSuccess, this.rerenderView)
    this.listenTo(IssueActions.fetchByIdFailed, router.goto.bind(null, '/'))
    this.listenTo(RequestStore, _.noop, this.routeUpdated)
    this.bindTo(IssueStore, 'issue')
    this.listenTo(CommentStore, this.updateComments)
  },

  updateComments(comments) {
    var votes = {};
    var upvotePattern = /\+1/;
    var downvotePattern = /\-1/;

    _.each(comments, (comment) => {
      if(upvotePattern.test(comment.body)) {
        votes[comment.user.login] = { type : 'upvote', comment: comment };
      } else if (downvotePattern.test(comment.body)) {
        votes[comment.user.login] = { type: 'downvote', comment: comment };
      }
    });

    var upvotes = _.filter(votes, (vote) => {
      if (_.isEqual(vote.type, 'upvote')) {
        return vote.comment;
      }
    });

    var downvotes = _.filter(votes, (vote) => {
      if (_.isEqual(vote.type, 'downvote')) {
        return vote.comment;
      }
    });

    this.setState({comments: comments, upvotes : _.pluck(upvotes, 'comment'), downvotes: _.pluck(downvotes, 'comment') })
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


  _renderFaces(dom, votes) {
    var { a, img } = dom;
    return _.map(votes, (vote) => {
      return a(
          img({
            alt: vote.user.login,
            title : vote.user.login,
            class: 'profile-image',
            src: 'https://avatars3.githubusercontent.com/u/' + vote.user.id + '?v=3&amp;s=80'
          })
        )
    })
  },


  _renderFacepile(dom, type, state) {
    var { div, h5 } = dom;
    var className = type === 'upvotes' ? 'success' : 'danger';
    var typeOfUser = type === 'upvotes' ? '+1`ers' : '-1`ers';
    var votes = state[type];

    if (! votes.length) {
      return div('')
    }

    return div({class: 'participants-wrapper'},
      h5({class: 'bold italic text-' + className}, typeOfUser),
      div({class: 'facepile-container'},
        this._renderFaces(dom, votes)
      )
    );
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

  renderArrows(dom, state) {
    var { div, a, i } = dom
    var { user, upvotes, downvotes } = state

    var upvoteClass
    var upvoteClickHandler = this.upvote.bind(null, state)
    var downvoteClass
    var downvoteClickHandler = this.downvote.bind(null, state)

    if (user) {
      // if user logged in, look for his vote
      _.each(upvotes, (upvote) => {
        if(_.isEqual(upvote.user.login, user.github.username)) {
          upvoteClass = 'text-success';
          upvoteClickHandler = _.noop;
        }
      });

      if (!upvoteClass) {
        _.each(downvotes, (downvote) => {
          if(_.isEqual(downvote.user.login, user.github.username)) {
            downvoteClass = 'text-danger';
            downvoteClickHandler = _.noop;
          }
        })
      }
    }

    return div({class: 'arrow-box'},
      a({class: 'big-vote text-g'},
        i({class: 'fa fa-caret-up ' + upvoteClass, onClick: upvoteClickHandler})
      ),
      a({class: 'big-vote down text-g'},
        i({class: 'fa fa-caret-down ' + downvoteClass, onClick: downvoteClickHandler})
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
            this.renderArrows(this.dom, state),
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
        this._renderFacepile(this.dom, 'upvotes', state),
        this._renderFacepile(this.dom, 'downvotes', state),
        div({class: 'description-wrapper'},
          p({class: 'lead text-gl'}, issue.body)
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