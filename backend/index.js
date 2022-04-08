const app = require('fastify')()

const config = require('./config')[process.env.NODE_ENV || 'development']

app.decorate('config', config)

app.decorate('enums', require('./enums'))

app.decorate('utils', require('./utils'))

app.register(require('fastify-oas'), config.oas)

app.register(require('fastify-knexjs'), config.knex)

app.register(require('fastify-cookie'), config.cookie)

app.register(require('fastify-sensible'))

app.register(require('./mailer'), config.mailer)

app.register(require('./tokenizer'), config.tokenizer)

app.register(require('./app'))

app.ready((err) => {
  if (err) {
    console.error(`Server: Ready error - ${err}`)
    process.exit(1)
  }

  app.oas()
})

app.listen(config.server, (err, addr) => {
  if (err) {
    console.error(`Server: Listen error - ${err}`)
    process.exit(1)
  }

  console.info(`Server: Listen address - ${addr}`)
})
