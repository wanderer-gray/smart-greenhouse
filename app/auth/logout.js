module.exports = {
  schema: {
    description: 'Выйти из системы',
    tags: ['Auth'],
    summary: 'Выход'
  },
  handler: function (_, reply) {
    reply
      .clearCookie('userId')
      .send()
  }
}
