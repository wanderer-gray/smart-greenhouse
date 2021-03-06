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

  app.register(require('./group'), { prefix: '/group' })

  app.register(require('./metric'), { prefix: '/metric' })

  app.register(require('./event'), { prefix: '/event' })
}
