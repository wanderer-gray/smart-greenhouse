module.exports = {
  schema: {
    description: 'Выйти из системы',
    tags: ['Auth'],
    summary: 'Выход'
  },
  handler: function (request, reply) {
    if (!this.utils.checkAuth(request)) {
      throw this.httpErrors.notFound()
    }

    reply
      .clearCookie('userId')
      .send()
  }
}
