import _ from 'lodash'
import component from 'lib/component'
import commentModel from 'models/commentModel'
import CommentActions from 'actions/CommentActions'
import CommentStore from 'stores/CommentStore'

export default component({
  initialState() {
    return {
      userVote: null
    }
  },

  beforeMount(props, state) {
    commentModel.get(props.issue.id).then((comment) => {
      this.setState({ comment })
    })

    // TODO: bind comment changes to the vote state
    // this.bindTo(CommentStore, 'comment')
  },

  handleVote(type) {
    if (this.state.userVote === type) return

    var method = (type === 'down') ? 'voteDown' : 'voteUp'
    CommentActions[method](props.issueId)
  },

  _requestLogin() {

  },

  render(props) {
    var upvoteClasses = ['fa', 'fa-caret-up']
    var downvoteClasses = ['fa', 'fa-caret-down']
    var { div, button, i } = this.dom
    var { user, upvotes, downvotes } = this.state

    if (this.state.userVote === 'up') {
      upvoteClasses.push('text-success')
    } else if (this.state.userVote === 'down') {
      downvoteClasses.push('text-danger')
    }

    return div({class: 'arrow-box'},
      button({class: 'big-vote vote-up text-g'},
        i({class: upvoteClasses.join(' '), onClick: _.partial(this.handleVote, 'up') })
      ),
      button({class: 'big-vote vote-down text-g'},
        i({class: downvoteClasses.join(' '), onClick: _.partial(this.handleVote, 'down') })
      )
    )
  }
})