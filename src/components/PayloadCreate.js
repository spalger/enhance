import component from 'lib/component'
import PayloadActions from 'actions/PayloadActions'
// import PayloadStore from 'stores/PayloadStore'

export default component({
  afterMount() {
    console.log('button mounted')
    // PayloadActions.generate.
  },

  generate() {
    console.log('click')
    // PayloadActions.generate();
  },

  render() {
    var { a, i } = this.dom
    return a({ class: 'btn btn-lg btn-default full-width context-margin', onClick: this.generate },
      i({ class: 'fa fa-cubes' }),
      ' Generate Project Payload'
    );
  }
})
