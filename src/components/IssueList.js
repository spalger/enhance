import component from 'lib/component'
import moment from 'moment'
import _ from 'lodash'
import LoadingContent from 'LoadingContent'

import RequestStore from 'stores/RequestStore'
import IssueStore from 'stores/IssueStore'
// import PopularityStore from 'stores/PopularityStore'
import IssueActions from 'actions/IssueActions'

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
    //this.listenTo(PopularityStore, this.addScores, this.addScores)

    IssueActions.fetch()
  },

  getIssues(dom, state) {
    var {div, ul, li, a, img, p, span, h3} = dom

    if (! state.issues) {
      return this.el(LoadingContent)
    } else if(! state.issues.length) {
      return (
        'No open enhancements'
      )
    }

    return _.map(state.issues, (issue) => {
      var popularity = div('');
      if (issue.score) {
        popularity = div({class: 'col-xs-2 centered shrink-gutter-left shrink-gutter-right'},
          h3('Popularity'),
          p(''),
          p({class: 'big-count'}, issue.score)
        );
      }

      return (
        li({class: 'list-group-item issue-list-item'},
          popularity,
          div({class: 'title'},
            h3({class: 'issue-name'},
              a({href: '/#/issue/' + issue.number}, issue.title)
            ),
            p({class: 'enhancement-description'}, issue.body)
          ),
          div({class: 'meta'},
            ul({class: 'list-unstyled issue-info-list'},
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
          div({class: 'profile'},
            div({class: 'issue-profile-image'},
              img({ src: 'https://avatars2.githubusercontent.com/u/' + issue.user.id + '?v=3&s=50'})
            )
          )
        )
      );

    });
    // need issue title, description, number, moment.ago, author, numComments, upvotes/downvotes
  },

  getSearchBar(dom) {
    var { div, input } = dom

    return div({class: 'search-container'},
      input( { onKeyUp: IssueActions.search, class: 'form-control', placeholder: 'Search by title or issue number' })
    )
  },

  render(props, state) {
    // deps
    if (!state.route) return;

    var {div, ul} = this.dom

    return div({class: 'panel panel-default'},
      ul({class: 'list-group'},
        this.getSearchBar(this.dom),
        this.getIssues(this.dom, state)
      )
    )
  }
})