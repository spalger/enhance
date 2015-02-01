import component from 'lib/component'

import GithubAvatar from 'components/GithubAvatar'
import CommentActions from 'actions/CommentActions'

export default component({
  initialState() {
    return {
      commentText: ''
    }
  },

  handleAddComment(ev, props, state) {
    debugger
    var commentText = this.refs('textInput').value
    CommentActions.create(props.issueId, commentText)
  },

  render(props, state) {
    var { user } = props
    var { div, a, img, h4, textarea, button, span, i } = this.dom
    var { newComment } = state
    var image = span('');
    var username = user.profile && user.profile.name ? user.profile.name : 'Please login to comment'

    if (user) {
      image = a(this.el(GithubAvatar, { id: user.github.id })
    }

    var commentBoxClass = state.showCommentBox ? ' show-comment-box' : '';

    return (
      div({ class: 'comment-media media' + commentBoxClass },
        div({ class: 'media-left' }, image),
        div({ class: 'media-body' },
          h4({ class: 'media-heading' },
            a({ class: 'username bold text-glr' }, username)
          ),
          textarea({ class: 'form-control', ref: 'textInput' }, this.commentText),
          button(
            { class: 'btn btn-sm btn-success pull-right add-comment-button', onClick : this.handleAddComment },
            i({ class: 'fa fa-plus' }, ' Comment')
          )
        )
      )
    )
  }

})