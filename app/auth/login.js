module.exports = {
  schema: {
    description: 'Вход в систему',
    tags: ['Auth'],
    summary: 'Вход',
    body: {
      type: 'object',
      required: [
        'nickname',
        'password'
      ],
      additionalProperties: false,
      properties: {
        nickname: {
          description: 'Ник',
          type: 'string',
          minLength: 8,
          maxLength: 255
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
    const { nickname, password } = request.body

    const user = await this.knex('user')
      .where({ nickname })
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
