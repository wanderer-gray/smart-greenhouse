const app = require('fastify')()

const config = require('./config')[process.env.NODE_ENV || 'development']

app.decorate('config', config)

app.decorate('utils', require('./utils'))

app.register(require('./mailer'), config.mailer)

app.register(require('fastify-oas'), config.oas)

app.register(require('fastify-knexjs'), config.knex)

app.register(require('fastify-cookie'), config.cookie)

app.register(require('fastify-sensible'))

app.register(require('./app'))

app.ready((err) => {
  if (err) {
    app.log.error(`Error ready server: ${err}`)
    process.exit(1)
  }

  app.oas()
})

app.listen(config.server, (err) => {
  if (err) {
    app.log.error(`Error listen server: ${err}`)
    process.exit(1)
  }
})
