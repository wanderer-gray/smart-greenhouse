'use strict'

module.exports = {
  schema: {
    description: 'Отправка токена на почту для регистрации',
    tags: ['auth'],
    summary: 'Отправка токена для регистрации',
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
  handler: async function (request, reply) {
    const { email } = request.query

    await this.knex.transaction(async (trx) => {
      await trx.raw('set transaction isolation level serializable')

      const existsUser = await this.utils.existsUserByEmail(email, trx)

      if (existsUser) {
        throw this.httpErrors.forbidden()
      }

      await trx('token')
        .where({ email })
        .del()

      const token = await this.utils.randomToken()
      const createdAt = this.utils.getDateISO()

      await trx('token')
        .insert({
          email,
          token,
          createdAt
        })

      this.mailer.sendMailNoWait({
        from: '"smart-greenhouse"',
        to: email,
        subject: 'Register token',
        text: `Your token: "${token}"`
      })
    })

    reply.send()
  }
}
