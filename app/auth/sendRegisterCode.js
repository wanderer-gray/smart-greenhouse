module.exports = {
  schema: {
    description: 'Отправка кода на почту для регистрации',
    tags: ['Auth'],
    summary: 'Отправка кода для регистрации',
    querystring: {
      type: 'object',
      required: ['email'],
      additionalProperties: false,
      properties: {
        email: {
          description: 'Почта',
          type: 'string',
          format: 'email'
        }
      }
    }
  },
  handler: async function (request) {
    const { email } = request.query

    await this.knex.transaction({ isolationLevel: 'serializable' }, async (trx) => {
      const existsUser = await this.utils.existsUserByEmail(email, trx)

      if (existsUser) {
        throw this.httpErrors.conflict()
      }

      const token = await this.utils.randomString(8)

      await trx('token')
        .insert({
          email,
          token
        })
    })

    // @todo Переделать на exists!!!
    return this.knex('user')
      .where({ email })
      .first('userId', 'salt', 'hash')
  }
}
