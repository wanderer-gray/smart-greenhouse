module.exports = (app, _, done) => {
  app.log.debug('Mount "API"')

  app.register(require('./health'), { prefix: '/health' })

  done()
}
