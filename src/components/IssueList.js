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

  getIssues() {
    var {div, ul, li, a, img, i, p, span, h3} = this.dom

    // need issue title, description, number, moment.ago, author, numComments, upvotes/downvotes
    return (
      li({class: 'list-group-item issue-list-item'},
        div({class: 'col-xs-2 centered shrink-gutter-left shrink-gutter-right'},
          div(
            a({class: 'voting-links centered noselect'},
              i({class: 'fa fa-caret-up'})
            )
          ),
          div(
            a({class: 'voting-links centered noselect'},
              i({class: 'fa fa-caret-down'})
            )
          ),
          p({class: 'big-count noselect'}, '100')
        ),
        div({class: 'col-xs-6 table-centered'},
          h3({class: 'issue-name'}, 'Issue Name Enhancement'),
          p({class: 'enhancement-description noselect'}, 'Turkey sirloin ground round hamburger. Aliquip in enim tail dolore salami')
        ),
        div({class: 'col-xs-3 no-gutter-left srhink-gutter-right'},
          ul({class: 'list-unstyled issue-info-list noselect'},
            li(
              span({class: 'bold'}, '#120'),
              ' opened ',
              span({class: 'bold'}, '[time]'),
              ' ago'
            ),
            li(
              'by ',
              a({class: 'bold'}, 'captainhurst')
            ),
            li({class: 'list-space'},
              span({class: 'bold'}, '15'),
              ' comments'
            )
          )
        ),
        div({class: 'col-xs-1 no-gutter'},
          div({class: 'issue-profile-image'},
            img({ src: 'https://avatars2.githubusercontent.com/u/4029749?v=3&s=50'})
          )
        )
      )
    );
  },

  render(props, state) {
    // deps
    if (!state.route) return;

    var {div, ul} = this.dom

    return div({class: 'panel panel-default'},
      ul({class: 'list-group'},
        this.getIssues(this.dom)
      )
    )
  }
})