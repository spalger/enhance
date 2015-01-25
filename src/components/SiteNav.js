import _ from 'lodash'
import deku from 'deku'
import component from 'lib/component'
import UserBadge from 'components/UserBadge'
import UserStore from 'stores/UserStore'

export default component({
  constructor() {
    this.handlers = {
      voteActive: _.exec(this, 'makeActive', 'Vote'),
      createActive: _.exec(this, 'makeActive', 'Create'),
      aboutActive: _.exec(this, 'makeActive', 'About')
    }
  },

  beforeMount() {
    this.bindTo(UserStore, 'user')
  },

  initialState() {
    return { active : null }
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

    var navLinks = [
      li({ onClick: this.handlers.voteActive, class: getClass('Vote')},
        a({class: 'bold', href: '#/'},
          i({class: 'fa fa-sort'}),
          span({class: 'hidden-xs'}, ' Vote')
        )
      ),
      li({ onClick: this.handlers.createActive, class: getClass('Create')},
        a({class: 'bold', href: '#/create-issue'},
          i({class: 'fa fa-plus'}),
          span({class: 'hidden-xs'}, ' Create Issue')
        )
      ),
      li({ onClick: this.handlers.aboutActive, class: getClass('About')},
        a({class: 'bold', href: '#/about'},
          i({class: 'fa fa-cog'}),
          span({class: 'hidden-xs'}, ' About')
        )
      ),
      li(
        deku.dom(UserBadge)
      )
    ];

    if (state.user) {
      navLinks.push(
        li(
          a({ class: 'bold', href: '#/logout' },
            i({ class: 'fa fa-sign-out'})
          )
        )
      );
    }

    return div({class: 'navbar navbar-default navbar-static-top noselect'},
      div({class: 'container-fluid'},
        a({class: 'navbar-brand text-info bold', href: '#'},
          em(' ENHANCE')
        ),
        ul({class: 'nav navbar-nav pull-right'}, navLinks)
      )
    )
  }
})