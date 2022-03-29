module.exports = (app, _, done) => {
  app.log.debug('Mount "health"')

  app.get('/', require('./health'))

  done()
}
