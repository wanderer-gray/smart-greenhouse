module.exports = (app, _, done) => {
  app.log.debug('Mount "api"')

  app.addHook('onRequest', async function (request) {
    if (!this.utils.checkAuth(request)) {
      throw this.httpErrors.forbidden()
    }
  })

  done()
}
