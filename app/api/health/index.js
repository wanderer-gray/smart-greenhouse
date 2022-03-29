const schema = {
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
}

const handler = () => new Date().toISOString()

module.exports = (app, _, done) => {
  app.log.debug('Mount "health"')

  app.get('/', { schema }, handler)

  done()
}
