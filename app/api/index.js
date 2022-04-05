module.exports = async function (app) {
  console.log('Mount "api"')

  app.addHook('onRequest', async function (request) {
    if (!this.utils.checkAuth(request)) {
      throw this.httpErrors.unauthorized()
    }
  })
}
