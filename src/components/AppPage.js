import _ from 'lodash'
import component from 'lib/component'

import IssueActions from 'actions/IssueActions'
import IssueStore from 'stores/IssueStore' // jshint ignore:line

import CommentActions from 'actions/CommentActions'
import CommentStore from 'stores/CommentStore' // jshint ignore:line

export default component({
  tagName: 'app-page',
  render() {
    var {div, h1, button} = this.dom
    return div(
      h1('static showdown 2015!'),
      button({ onClick : _.bindKey(IssueActions, 'getAll') }, 'Load github issues'),
      button({ onClick : _.bindKey(CommentActions, 'getByIssue', 1) }, 'Load comments for issue 1')
    )
  }
})