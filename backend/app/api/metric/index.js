module.exports = async function (app) {
  console.log('Mount "metric"')

  const {
    utils,
    schemas,
    knex,
    mailer,
    httpErrors
  } = app

  const addSchema = {
    description: 'Добавление метрики от умного устройства',
    tags: ['iot', 'metric'],
    summary: 'Добавление метрики',
    querystring: {
      type: 'object',
      required: [
        'iotId',
        'value'
      ],
      additionalProperties: false,
      properties: {
        iotId: schemas.iot.iotId,
        value: schemas.metric.value
      }
    },
    response: {
      200: {
        description: 'Настройки умного устройства',
        type: 'object',
        required: [
          'hello',
          'min',
          'max'
        ],
        additionalProperties: false,
        properties: {
          hello: schemas.iot.hello,
          min: schemas.iot.min,
          max: schemas.iot.max
        }
      }
    }
  }

  app.get('/iot/search', { schema: addSchema }, function (request) {
    const { userId } = request
    const { iotId } = request.query
    
  })
}
