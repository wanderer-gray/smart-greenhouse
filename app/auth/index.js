module.exports = async function (app) {
  console.log('Mount "auth"')

  const {
    utils,
    knex,
    mailer,
    httpErrors
  } = app

  const emailSchema = {
    description: 'Почта',
    type: 'string',
    format: 'email'
  }
  const passwordSchema = {
    description: 'Пароль',
    type: 'string',
    minLength: 8,
    maxLength: 255
  }
  const tokenSchema = {
    description: 'Токен',
    type: 'integer',
    minimum: 10 ** 5,
    maximum: 10 ** 6 - 1
  }

  const setCookieUserId = (userId, reply) => {
    reply
      .setCookie('userId', JSON.stringify(userId), {
        path: '/',
        httpOnly: true,
        signed: 'true'
      })
      .send()
  }

  const existsUserByEmail = (email, knex) => {
    const subQuery = knex('user')
      .where({ email })

    return utils.existsKnex(subQuery, knex)
  }

  const deleteTokenByEmail = (email, knex) => {
    return knex('token')
      .where({ email })
      .del()
  }

  const checkTokenValid = (email, token, knex) => {
    const now = utils.getDateISO()

    const subQuery = knex('token')
      .where({
        email,
        token
      })
      .where('createdAt', '>=', knex.raw('?::timestamp - interval \'5 minutes\'', [now]))

    return utils.existsKnex(subQuery, knex)
  }

  const healthSchema = {
    description: 'Проверка аутентификации',
    tags: ['auth'],
    summary: 'Проверка аутентификации',
    response: {
      200: {
        description: 'Аутентифицирован ли пользователь',
        type: 'boolean'
      }
    }
  }

  app.get('/checkAuth', { schema: healthSchema }, function (request) {
    return utils.checkAuth(request)
  })

  const existsEmailSchema = {
    description: 'Проверка почты на существование',
    tags: ['auth'],
    summary: 'Проверка почты',
    querystring: {
      type: 'object',
      required: ['email'],
      additionalProperties: false,
      properties: {
        email: emailSchema
      }
    },
    response: {
      200: {
        description: 'Почта существует',
        type: 'boolean'
      }
    }
  }

  app.get('/existsEmail', { schema: existsEmailSchema }, function (request) {
    const { email } = request.query

    return existsUserByEmail(email, knex)
  })

  const loginSchema = {
    description: 'Вход в систему',
    tags: ['auth'],
    summary: 'Вход',
    body: {
      type: 'object',
      required: [
        'email',
        'password'
      ],
      additionalProperties: false,
      properties: {
        email: emailSchema,
        password: passwordSchema
      }
    }
  }

  app.post('/login', { schema: loginSchema }, async function (request, reply) {
    const { email, password } = request.body

    const user = await knex('user')
      .where({ email })
      .first('userId', 'salt', 'hash')

    if (!user) {
      throw httpErrors.unauthorized()
    }

    const { userId, salt, hash } = user

    const ok = await utils.checkHash(password, salt, hash)

    if (!ok) {
      throw httpErrors.unauthorized()
    }

    setCookieUserId(userId, reply)
  })

  const logoutSchema = {
    description: 'Выйти из системы',
    tags: ['auth'],
    summary: 'Выход'
  }

  app.delete('/logout', { schema: logoutSchema }, function (_, reply) {
    reply
      .clearCookie('userId')
      .send()
  })

  const sendRestoreTokenSchema = {
    description: 'Отправка токена на почту для восстановления',
    tags: ['auth'],
    summary: 'Отправка токена для восстановления',
    querystring: {
      type: 'object',
      required: ['email'],
      additionalProperties: false,
      properties: {
        email: emailSchema
      }
    }
  }

  app.post('/sendRestoreToken', { schema: sendRestoreTokenSchema }, async function (request, reply) {
    const { email } = request.query

    await knex.transaction(async (trx) => {
      await trx.raw('set transaction isolation level serializable')

      const existsUser = await existsUserByEmail(email, trx)

      if (!existsUser) {
        throw httpErrors.notFound()
      }

      await deleteTokenByEmail(email, trx)

      const token = await utils.randomToken()
      const createdAt = utils.getDateISO()

      await trx('token')
        .insert({
          email,
          token,
          createdAt
        })

      mailer.sendMailNoWait({
        from: '"smart-greenhouse"',
        to: email,
        subject: 'Restore token',
        text: `Your token: "${token}"`
      })
    })

    reply.send()
  })

  const restoreSchema = {
    description: 'Восстановление в системе',
    tags: ['auth'],
    summary: 'Восстановление',
    querystring: {
      type: 'object',
      required: [
        'email',
        'token'
      ],
      additionalProperties: false,
      properties: {
        email: emailSchema,
        token: tokenSchema
      }
    },
    body: {
      type: 'object',
      required: ['password'],
      additionalProperties: false,
      properties: {
        password: passwordSchema
      }
    }
  }

  app.put('/restore', { schema: restoreSchema }, async function (request, reply) {
    const { email, token } = request.query
    const { password } = request.body

    const userId = await knex.transaction(async (trx) => {
      await trx.raw('set transaction isolation level serializable')

      const tokenValid = await checkTokenValid(email, token, trx)

      if (!tokenValid) {
        throw httpErrors.forbidden()
      }

      await deleteTokenByEmail(email, trx)

      const salt = await utils.getSalt()
      const hash = await utils.getHash(password, salt)

      const [userId] = await trx('user')
        .where({ email })
        .update({
          salt,
          hash
        })
        .returning('userId')

      return userId
    })

    setCookieUserId(userId, reply)
  })

  const sendRegisterTokenSchema = {
    description: 'Отправка токена на почту для регистрации',
    tags: ['auth'],
    summary: 'Отправка токена для регистрации',
    querystring: {
      type: 'object',
      required: ['email'],
      additionalProperties: false,
      properties: {
        email: emailSchema
      }
    }
  }

  app.post('/sendRegisterToken', { schema: sendRegisterTokenSchema }, async function (request, reply) {
    const { email } = request.query

    await knex.transaction(async (trx) => {
      await trx.raw('set transaction isolation level serializable')

      const existsUser = await existsUserByEmail(email, trx)

      if (existsUser) {
        throw httpErrors.forbidden()
      }

      await deleteTokenByEmail(email, trx)

      const token = await utils.randomToken()
      const createdAt = utils.getDateISO()

      await trx('token')
        .insert({
          email,
          token,
          createdAt
        })

      mailer.sendMailNoWait({
        from: '"smart-greenhouse"',
        to: email,
        subject: 'Register token',
        text: `Your token: "${token}"`
      })
    })

    reply.send()
  })

  const registerSchema = {
    description: 'Регистрация в системе',
    tags: ['auth'],
    summary: 'Регистрация',
    querystring: {
      type: 'object',
      required: [
        'email',
        'token'
      ],
      additionalProperties: false,
      properties: {
        email: emailSchema,
        token: tokenSchema
      }
    },
    body: {
      type: 'object',
      required: ['password'],
      additionalProperties: false,
      properties: {
        password: passwordSchema
      }
    }
  }

  app.post('/register', { schema: registerSchema }, async function (request, reply) {
    const { email, token } = request.query
    const { password } = request.body

    const userId = await knex.transaction(async (trx) => {
      await trx.raw('set transaction isolation level serializable')

      const tokenValid = await checkTokenValid(email, token, trx)

      if (!tokenValid) {
        throw httpErrors.forbidden()
      }

      await deleteTokenByEmail(email, trx)

      const salt = await utils.getSalt()
      const hash = await utils.getHash(password, salt)

      const [userId] = await trx('user')
        .insert({
          email,
          salt,
          hash
        })
        .returning('userId')

      return userId
    })

    setCookieUserId(userId, reply)
  })
}
