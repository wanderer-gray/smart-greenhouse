const fastify = require('fastify')

const config = require('./config')

const app = fastify({
  logger: {
    level: 'debug',
    prettyPrint: true
  }
})

app.decorate('config', config)

app.register(require('fastify-oas'), {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'smart-greenhouse',
      description: 'ТюмГУ, ИВ, МЛР, "smart-greenhouse"',
      version: '1.0.0'
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'IoT', description: 'Интернет вещей' },
      { name: 'Other', description: 'Другое' }
    ]
  },
  exposeRoute: true
})

app.register(require('fastify-cookie'), config.cookie)

app.register(require('fastify-knexjs'), config.knex, (err) => {
  app.log.error(`Error register knex: ${err}`)
  process.exit()
})

app.register(require('./app'))

app.listen(config.server, (err) => {
  if (err) {
    app.log.error(`Error starting server: ${err}`)
    process.exit()
  }
})
