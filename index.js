import { join } from 'path'

module.exports = (kibana) => {

  return new kibana.Plugin({
    init: (server, options) => {
      require('./app/routes')(server, kibana.uiExports)
    },

    uiExports: {
      app: {
        title: 'Enhance',
        description: 'Issues in Kibana',
        main: 'plugins/enhance/main',
        autoload: kibana.autoload.styles,
      },

      modules: {
        rui: join(__dirname, 'public', 'rui'),
      },
    },
  })

}
