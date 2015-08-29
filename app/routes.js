import Joi from 'joi'
import { chunk } from 'lodash'

module.exports = (server, uiExports) => {
  let messages = []

  server.route({
    path: '/app/enhance/{path*}',
    method: 'GET',
    handler: (req, reply) => {
      return reply.renderApp(uiExports.getApp('enhance'))
    },
  })

  server.route({
    path: '/api/enhance/messages',
    method: 'GET',
    config: {
      validate: {
        query: Joi.object().keys({
          page: Joi.number().default(1),
          perPage: Joi.number().default(20),
        }).default(),
      },
      handler(req, reply) {
        let { page, perPage } = req.query
        return reply(chunk(messages, perPage)[page - 1] || [])
      },
    },
  })

  server.route({
    path: '/api/enhance/messages',
    method: 'POST',
    config: {
      validate: {
        payload: Joi.object().keys({
          to: Joi.string().email().required(),
          from: Joi.string().email().required(),
          body: Joi.string().required(),
        }).required(),
      },
      handler: (req, reply) => {
        let message = {
          id: messages.length + 1,
          ...req.payload,
        }
        messages.push(message)
        return reply(message)
      },
    },
  })

}
