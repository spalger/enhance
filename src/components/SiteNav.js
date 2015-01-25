import _ from 'lodash'
import deku from 'deku'
import component from 'lib/component'
import UserBadge from 'components/UserBadge'

export default component({
  constructor() {
    this.handlers = {
      voteActive : _.bindKey(this, 'makeActive', 'Vote'),
      createActive : _.bindKey(this, 'makeActive', 'Create'),
      setupActive : _.bindKey(this, 'makeActive', 'Setup')
    }
  },

  initialState() {
    return { active : 'Vote' }
  },

  makeActive(active) {
    console.log(active); // @todo grab from routes versus click handlers
    this.setState({ active })
  },

  render(props, state) {
    var {div, a, ul, li, i, em, span} = this.dom

    function getClass(section) {
      if (_.isEqual(state.active, section)) {
        return 'active';
      }
      return '';
    }

    return div({class: 'navbar navbar-default navbar-static-top noselect'},
      div({class: 'container-fluid'},
        a({class: 'navbar-brand text-info bold', href: '#'},
          i({class: 'fa fa-github'}),
          em(' ENHANCE')
        ),
        ul({class: 'nav navbar-nav pull-right'},
          li({ onClick : this.handlers.voteActive, class: getClass('Vote')},
            a({class: 'bold', href: '#'},
              i({class: 'fa fa-sort'}),
              span({class: 'hidden-xs'}, ' Vote')
            )
          ),
          li({ onClick : this.handlers.createActive, class: getClass('Create')},
            a({class: 'bold', href: '#/create-issue'},
              i({class: 'fa fa-plus'}),
              span({class: 'hidden-xs'}, ' Create Issue')
            )
          ),
          li({ onClick : this.handlers.setupActive, class: getClass('Setup')},
            a({class: 'bold', href: '#/setup'},
              i({class: 'fa fa-cog'}),
              span({class: 'hidden-xs'}, ' Setup')
            )
          ),
          li(
            deku.dom(UserBadge)
          )
        )
      )
    )
  }
})