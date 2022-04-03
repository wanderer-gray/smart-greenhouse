module.exports = {
  schema: {
    description: 'Проверка почты на существование',
    tags: ['auth'],
    summary: 'Проверка почты',
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
    },
    response: {
      200: {
        description: 'Почта существует',
        type: 'boolean'
      }
    }
  },
  handler: async function (request) {
    const { email } = request.query

    return this.utils.existsUserByEmail(email, this.knex)
  }
}
