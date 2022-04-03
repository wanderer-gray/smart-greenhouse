const config = require('./config')[process.env.NODE_ENV ?? 'development']

const fastify = require('fastify')()

const configServer = config.server

fastify.register(require('fastify-oas'), {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'smart-greenhouse',
      description: 'ТюмГУ, ИВ, МЛР, 22 ИБАС 188',
      version: '1.0.0'
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    servers: [{
      url: `http://${configServer.host}:${configServer.port}`,
      description: 'Local server'
    }],
    tags: [
      { name: 'Auth', description: 'Аутентификация' },
      { name: 'IoT', description: 'Интернет вещей' },
      { name: 'Other', description: 'Другое' }
    ]
  },
  exposeRoute: true
})

fastify.register(require('fastify-cookie'), config.cookie)

fastify.register(require('fastify-sensible'))

fastify.decorate('config', config)

fastify.decorate('utils', require('./utils'))

fastify.decorate('knex', require('knex')(config.knex))

fastify.register(require('./app'))

fastify.ready((err) => {
  if (err) {
    fastify.log.error(`Error starting server: ${err}`)
    process.exit(1)
  }

  fastify.oas()
})

fastify.listen(configServer, (err) => {
  if (err) {
    fastify.log.error(`Error starting server: ${err}`)
    process.exit(1)
  }
})
