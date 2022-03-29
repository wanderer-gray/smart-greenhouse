module.exports = (app, _, done) => {
  app.decorateRequest('userId', null)

  app.addHook('onRequest', async (req, reply) => {
    const signUserId = req.cookies.userId

    if (typeof signUserId !== 'string') {
      return
    }

    const unsignUserId = reply.unsignCookie(signUserId)

    if (unsignUserId.valid && !unsignUserId.renew) {
      req.userId = JSON.parse(unsignUserId.value)
    }
  })

  app.register(require('./auth'), { prefix: '/auth' })
  app.register(require('./api'), { prefix: '/api' })

  done()
}
