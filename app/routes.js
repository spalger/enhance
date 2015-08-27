module.exports = (server, uiExports) => {

  // server.route({
  //   method: 'GET',
  //   path: '/api/enhance/',
  // })

  server.route({
    path: '/app/enhance/{path*}',
    method: 'GET',
    handler: function (req, reply) {
      return reply.renderApp(uiExports.getApp('enhance'));
    },
  })

}
