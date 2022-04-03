module.exports = {
  schema: {
    description: 'Проверка "здоровья"',
    tags: ['Other'],
    summary: 'Проверка',
    response: {
      200: {
        description: 'Текущая дата и время в формате ISO',
        type: 'string',
        format: 'date-time'
      }
    }
  },
  handler: function () {
    return new Date().toISOString()
  }
}
