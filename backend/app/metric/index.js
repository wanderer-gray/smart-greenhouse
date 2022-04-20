module.exports = async function (app) {
  console.log('Mount "iot_metric"')

  const {
    enums: {
      iot: {
        LIGHTING,
        HUMIDITY,
        TEMPERATURE
      }
    },
    utils,
    schemas,
    knex,
    mailer,
    httpErrors
  } = app

  const asserValue = (type, value) => {
    switch (type) {
      case LIGHTING:
        if (value < 0 || value > 24 * 60 * 60) {
          throw httpErrors.badRequest()
        }
        break

      case HUMIDITY:
        if (value < 0 || value > 100) {
          throw httpErrors.badRequest()
        }
        break

      case TEMPERATURE:
        if (value < -100 || value > +100) {
          throw httpErrors.badRequest()
        }
        break
    }
  }

  const addSchema = {
    description: 'Добавление метрики от умного устройства',
    tags: ['metric'],
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
      200: schemas.iot.hello
    }
  }

  app.post('/add', { schema: addSchema }, function (request) {
    const { iotId, value } = request.query

    return knex.transaction(async (trx) => {
      const iot = await trx('iot')
        .where({ iotId })
        .first('title', 'type', 'hello', 'min', 'max')

      if (!iot) {
        throw httpErrors.notFound()
      }

      const { title, type, hello, min, max } = iot

      asserValue(type, value)

      const [metricId] = await trx('metric')
        .insert({
          iotId,
          value,
          createAt: utils.getDateISO()
        })
        .returning('metricId')

      if (value < min || value > max) {
        const subject = value < min
          ? 'Критический показатель минимума'
          : 'Критический показатель максимума'
        const text = [
          `Устройство: "${title}"`,
          `Значение: "${value}"`
        ].join('\n')

        await trx('event')
          .insert({
            metricId,
            subject
          })

        const email = await trx('user')
          .whereExists((builder) => {
            builder
              .from('iot_owner')
              .where('userId', trx.ref('user.userId'))
              .where({ iotId })
          })
          .first('email')

        if (email) {
          mailer.sendMailNoWait({
            from: '"smart-greenhouse"',
            to: email,
            subject,
            text
          })
        }
      }

      return hello
    })
  })
}
