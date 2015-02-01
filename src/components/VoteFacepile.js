import component from 'lib/component'

export default component({
  beforeMount() {
    // TODO: fetch comment
    // TODO: fetch scores
    // TODO: fetch user data about votes
  },

  _renderLabel(type) {
    type = (type === 'upvotes') ? 'upvotes' : 'downvotes'
    { h5 } = this.dom
    var className = type === 'upvotes' ? 'text-success' : 'text-danger';
    var typeOfUser = type === 'upvotes' ? '+1`ers' : '-1`ers';
    return h5({class: className}, typeOfUser)
  },

  _renderFaces(type) {
    var { a, img } = this.dom;

    return this.state.votes
    .filter((vote) => {
      return vote.type === type
    })
    .map((vote) => {
      var avatarUrl = `https://avatars3.githubusercontent.com/u/${vote.user.id}?v=3&amp;s=80`

      return a(img({
        alt: vote.user.login,
        title : vote.user.login,
        class: 'profile-image',
        src: avatarUrl
      }))
    })
  },

  render() {
    var { div } = dom;
    var votes = state[type];

    if (! votes.length) {
      return div('')
    }

    return div({class: 'participants-wrapper'},
      div({ class: 'upvotes' }, this._renderLabel('upvotes'), this._renderFaces('upvotes')),
      div({ class: 'downvotes' }, this._renderLabel('downvotes'), this._renderFaces('downvotes')),
    );
  }
})
