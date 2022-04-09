module.exports = async function (app) {
  console.log('Mount "auth"')

  const {
    utils,
    schemas,
    knex,
    mailer,
    tokenizer,
    httpErrors
  } = app

  const existsUserByEmail = (email, knex) => {
    const subQuery = knex('user')
      .where({ email })

    return utils.existsKnex(subQuery, knex)
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

  const checkSchema = {
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

  app.get('/check', { schema: checkSchema }, function (request) {
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
        email: schemas.user.email
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
        email: schemas.user.email,
        password: schemas.user.password
      }
    }
  }

  app.post('/login', { schema: loginSchema }, async function (request, reply) {
    const { email, password } = request.body

    const user = await knex('user')
      .where({ email })
      .first('userId', 'salt', 'hash')

    if (!user) {
      throw httpErrors.notFound()
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

  const sendRestoreCodeSchema = {
    description: 'Отправка кода на почту для восстановления',
    tags: ['auth'],
    summary: 'Отправка кода для восстановления',
    querystring: {
      type: 'object',
      required: ['email'],
      additionalProperties: false,
      properties: {
        email: schemas.user.email
      }
    },
    response: {
      200: schemas.auth.token
    }
  }

  app.post('/sendRestoreCode', { schema: sendRestoreCodeSchema }, async function (request) {
    const { email } = request.query

    const existsUser = await existsUserByEmail(email, knex)

    if (!existsUser) {
      throw httpErrors.notFound()
    }

    const code = await utils.randomCode()
    const token = await tokenizer.sign({ email }, code, { expiresIn: '5m' })

    mailer.sendMailNoWait({
      from: '"smart-greenhouse"',
      to: email,
      subject: 'Restore code',
      text: `Your code: "${code}"`
    })

    return token
  })

  const restoreSchema = {
    description: 'Восстановление в системе',
    tags: ['auth'],
    summary: 'Восстановление',
    querystring: {
      type: 'object',
      required: [
        'code',
        'token'
      ],
      additionalProperties: false,
      properties: {
        code: schemas.auth.code,
        token: schemas.auth.token
      }
    },
    body: {
      type: 'object',
      required: ['password'],
      additionalProperties: false,
      properties: {
        password: schemas.user.password
      }
    }
  }

  app.put('/restore', { schema: restoreSchema }, async function (request, reply) {
    const { code, token } = request.query
    const { password } = request.body

    const { email } = await tokenizer.verify(token, code, httpErrors.forbidden())
    const salt = await utils.getSalt()
    const hash = await utils.getHash(password, salt)

    const [userId] = await knex('user')
      .where({ email })
      .update({
        salt,
        hash
      })
      .returning('userId')

    setCookieUserId(userId, reply)
  })

  const sendRegisterCodeSchema = {
    description: 'Отправка кода на почту для регистрации',
    tags: ['auth'],
    summary: 'Отправка кода для регистрации',
    querystring: {
      type: 'object',
      required: ['email'],
      additionalProperties: false,
      properties: {
        email: schemas.user.email
      }
    },
    response: {
      200: schemas.auth.token
    }
  }

  app.post('/sendRegisterCode', { schema: sendRegisterCodeSchema }, async function (request, reply) {
    const { email } = request.query

    const existsUser = await existsUserByEmail(email, knex)

    if (existsUser) {
      throw httpErrors.forbidden()
    }

    const code = await utils.randomCode()
    const token = await tokenizer.sign({ email }, code, { expiresIn: '5m' })

    mailer.sendMailNoWait({
      from: '"smart-greenhouse"',
      to: email,
      subject: 'Register code',
      text: `Your code: "${code}"`
    })

    return token
  })

  const registerSchema = {
    description: 'Регистрация в системе',
    tags: ['auth'],
    summary: 'Регистрация',
    querystring: {
      type: 'object',
      required: [
        'code',
        'token'
      ],
      additionalProperties: false,
      properties: {
        code: schemas.auth.code,
        token: schemas.auth.token
      }
    },
    body: {
      type: 'object',
      required: ['password'],
      additionalProperties: false,
      properties: {
        password: schemas.user.password
      }
    }
  }

  app.post('/register', { schema: registerSchema }, async function (request, reply) {
    const { code, token } = request.query
    const { password } = request.body

    const { email } = await tokenizer.verify(token, code, httpErrors.forbidden())
    const salt = await utils.getSalt()
    const hash = await utils.getHash(password, salt)

    const [userId] = await knex('user')
      .insert({
        email,
        salt,
        hash
      })
      .returning('userId')

    setCookieUserId(userId, reply)
  })
}
