import component from 'lib/component'
import moment from 'moment'
import _ from 'lodash'

import RequestStore from 'stores/RequestStore'
import IssueStore from 'stores/IssueStore'
import IssueActions from 'actions/IssueActions'

import log from 'lib/log'

export default component({
  initialState() {
    return {
      route: null,
      issues: null
    };
  },

  afterMount() {
    this.bindTo(RequestStore, 'route')
    this.bindTo(IssueStore, 'issues')

    IssueActions.fetch()

    log.msg('@TODO load issues -- IssueList.js')
  },

  getIssues(dom, state) {
    var {div, ul, li, a, img, i, p, span, h3} = dom
    console.log('new state: ', state);

    if (! state.issues) {
      return div(
        'Loading...'
      )
    } else if(! state.issues.length) {
      return (
        'No open enhancements'
      )
    }

    return _.map(state.issues, (issue) => {
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
            h3({class: 'issue-name'},
              a({href: '/#/issue/' + issue.number}, issue.title)
            ),
            p({class: 'enhancement-description noselect'}, issue.body)
          ),
          div({class: 'col-xs-3 no-gutter-left srhink-gutter-right'},
            ul({class: 'list-unstyled issue-info-list noselect'},
              li(
                span({class: 'bold'}, '#' + issue.number),
                ' opened ',
                span({class: 'bold'}, moment(issue.updated_at).fromNow()),
                ' ago'
              ),
              li(
                'by ',
                a({class: 'bold', href: issue.user.html_url}, issue.user.login)
              ),
              li({class: 'list-space'},
                span({class: 'bold'}, issue.comments),
                ' comments'
              )
            )
          ),
          div({class: 'col-xs-1 no-gutter'},
            div({class: 'issue-profile-image'},
              img({ src: 'https://avatars2.githubusercontent.com/u/' + issue.user.id + '?v=3&s=50'})
            )
          )
        )
      );

    });
    // need issue title, description, number, moment.ago, author, numComments, upvotes/downvotes
  },

  render(props, state) {
    // deps
    if (!state.route) return;

    var {div, ul} = this.dom

    return div({class: 'panel panel-default'},
      ul({class: 'list-group'},
        this.getIssues(this.dom, state)
      )
    )
  }
})