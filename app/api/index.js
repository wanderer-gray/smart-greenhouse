module.exports = (app, _, done) => {
  app.log.debug('Mount "api"')

  app.register(require('./health'), { prefix: '/health' })

  done()
}
