module.exports = {
  schema: {
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
        email: {
          description: 'Почта',
          type: 'string',
          format: 'email'
        },
        password: {
          description: 'Пароль',
          type: 'string',
          minLength: 8,
          maxLength: 255
        }
      }
    }
  },
  handler: async function (request, reply) {
    if (this.utils.checkAuth(request)) {
      throw this.httpErrors.conflict()
    }

    const { email, password } = request.body

    const user = await this.knex('user')
      .where({ email })
      .first('userId', 'salt', 'hash')

    if (!user) {
      throw this.httpErrors.unauthorized()
    }

    const { userId, salt, hash } = user

    const ok = await this.utils.checkHash(password, salt, hash)

    if (!ok) {
      throw this.httpErrors.unauthorized()
    }

    reply
      .setCookie('userId', JSON.stringify(userId), {
        path: '/',
        httpOnly: true,
        signed: 'true'
      })
      .send()
  }
}
