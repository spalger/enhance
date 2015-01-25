import component from 'lib/component'

import RequestStore from 'stores/RequestStore'

import log from 'lib/log'

export default component({
  initialState() {
    return {
      route: null
    };
  },

  afterMount() {
    this.bindTo(RequestStore, 'route')

    log.msg('@TODO load issues -- IssueList.js')
  },

  render(props, state) {
    // deps
    if (!state.route) return;

    var {div, ul, li, span, h1, h3, h4, h5, a, img, i, small, textarea, button, p} = this.dom

    return div({class: 'container'},
      div({class: 'row'},
        div({class: 'col-xs-12 col-sm-12-col-lg-10 col-lg-offset-1'},
          div({class: 'issue-header-wrapper'},
            div({class: 'arrow-box'},
              a({class: 'big-vote text-g'},
                i({class: 'fa fa-caret-up'})
              ),
              a({class: 'big-vote down text-g'},
                i({class: 'fa fa-caret-down'})
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
                a({class: 'text-success'},
                  i({class: 'fa fa-github'})
                ),
                ' Detailed Issue Title'
              ),
              h3({class: 'italic text-gl'}, '#1234')
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
          p({class: 'lead text-gl'}, 'Placeholder text')
        ),
        div({class: 'comment-wrapper'},
          div({class: 'comment-toolbar'},
            ul({class: 'tool-list'},
              li(
                a(
                  i({class: 'fa fa-plus'}, ' Add Comment')
                )
              )
            )
          ),
          div({class: 'comment-media media'},
            div({class: 'media-left'},
              a(
                img({class: 'media-object', src: 'https://avatars3.githubusercontent.com/u/885279?v=3&amp;s=64'})
              )
            ),
            div({class: 'media-body'},
              h4({class: 'media-heading'},
                a({class: 'username bold text-glr'}, '@username')
              ),
              textarea({class: 'form-control'}),
              button({class: 'btn btn-sm btn-success pull-right add-comment-button'},
                i({class: 'fa fa-plus'}, ' Comment')
              )
            )
          ),
          div({class: 'media'},
            div({class: 'media-left'},
              a(
                img({class: 'media-object', src: 'https://avatars3.githubusercontent.com/u/885279?v=3&amp;s=64'})
              )
            ),
            div({class: 'media-body'},
              h4({class: 'media-heading'},
                a({class: 'username bold text-g'},
                  '@username'
                )
              ),
              p({class: 'comment-text'}, 'Stuff and things')
            )
          ),
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