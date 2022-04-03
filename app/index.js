module.exports = async function (app) {
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

  const healthSchema = {
    description: 'Проверка "здоровья"',
    tags: ['other'],
    summary: 'Проверка',
    response: {
      200: {
        description: 'Текущая дата и время в формате ISO',
        type: 'string',
        format: 'date-time'
      }
    }
  }

  app.get('/health', { schema: healthSchema }, () => {
    return this.utils.getDateISO()
  })
}
