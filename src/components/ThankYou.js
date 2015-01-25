import component from 'lib/component'

export default component({
  render() {
    var {div} = this.dom

    return div(
      `
      Thank you for filing an issue with us. Please note that before it shows up in our Enhance app,
      the contributors need to review it and label it appropriately. In the meantime, you can start
      generating community support.
      `,
      div(
        'Social Media icons'
      )
    )
  }
})