import _ from 'lodash'
import component from 'lib/component'
import IssueActions from 'actions/IssueActions'
import IssueStore from 'stores/IssueStore' // jshint ignore:line

export default component({
  tagName: 'app-page',
  render() {
    var {div, h1, button} = this.dom
    return div(
      h1('static showdown 2015!'),
      button({ onClick : _.bindKey(IssueActions, 'getAll') }, 'Load github issues')
    )
  }
})