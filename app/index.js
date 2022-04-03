module.exports = (app, _, done) => {
  app.decorateRequest('userId', null)

  app.addHook('onRequest', async function (request, reply) {
    const signUserId = request.cookies.userId

    if (typeof signUserId !== 'string') {
      return
    }

    const unsignUserId = reply.unsignCookie(signUserId)

    if (unsignUserId.valid && !unsignUserId.renew) {
      request.userId = JSON.parse(unsignUserId.value)
    }
  })

  app.register(require('./auth'), { prefix: '/auth' })

  app.register(require('./api'), { prefix: '/api' })

  app.register(require('./health'), { prefix: '/health' })

  done()
}
