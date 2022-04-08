module.exports = async function (app) {
  console.log('Mount "api"')

  const {
    utils,
    httpErrors
  } = app

  app.addHook('onRequest', async function (request) {
    if (!utils.checkAuth(request)) {
      throw httpErrors.unauthorized()
    }
  })

  app.register(require('./iot'), { prefix: '/iot' })
}
