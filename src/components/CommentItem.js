import component from 'lib/component'

import GithubAvatar from 'components/GithubAvatar'

export default component({
  render(props) {
    var { comment } = props;
    var {div, a, img, h4} = dom

    if (! comments) {
      return div('Loading...')
    } else if (! comments.length) {
      return div('')
    }

    return div({class: 'issue-comment'},
      div({class: 'media-left'},
        this.el(GithubAvatar, { id: comment.user.id })
      ),
      div({class: 'media-body'},
        h4({class: 'media-heading'},
          a({class: 'username bold text-g', href: comment.user.html_url},
            comment.user.login
          )
        ),
        div(
          { class: 'comment-text' },
          this.el(Markdown, { markdown: comment.body })
        )
      )
    )
  }
})