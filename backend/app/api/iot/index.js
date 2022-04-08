module.exports = async function (app) {
  console.log('Mount "iot"')

  const {
    enums,
    utils,
    knex,
    httpErrors
  } = app

  const {
    iot: {
      LIGHTING,
      HUMIDITY,
      TEMPERATURE
    }
  } = enums

  const iotIdSchema = {
    description: 'Идентификатор устройства',
    type: 'string',
    format: 'uuid'
  }
  const iotTitleSchema = {
    description: 'Название устройства',
    type: 'string',
    minLength: 0,
    maxLength: 255
  }
  const iotTypeSchema = {
    description: 'Тип устройства',
    type: 'integer',
    enum: Object.values(enums.iot)
  }
  const iotHelloSchema = {
    description: 'Таймер обновления',
    type: 'integer',
    minimum: 1, // 1 sec
    maximum: 30 * 60 // 30 min
  }
  const iotMinSchema = {
    description: 'Критический показатель минимума',
    type: 'integer'
  }
  const iotMaxSchema = {
    description: 'Критический показатель максимума',
    type: 'integer'
  }
  const iotUpdateSchema = {
    title: iotTitleSchema,
    hello: iotHelloSchema,
    min: iotMinSchema,
    max: iotMaxSchema
  }
  const iotCreateSchema = {
    type: iotTypeSchema,
    ...iotUpdateSchema
  }
  const iotResponseSchema = {
    type: 'object',
    required: [
      'iotId',
      'title',
      'type',
      'hello',
      'min',
      'max'
    ],
    additionalProperties: false,
    properties: {
      iotId: iotIdSchema,
      ...iotCreateSchema
    }
  }

  const asserSetting = (type, min, max) => {
    switch (type) {
      case LIGHTING:
        if (min < 0 || max > 24 * 60 * 60) {
          throw httpErrors.badRequest()
        }
        break

      case HUMIDITY:
        if (min < 0 || max > 100) {
          throw httpErrors.badRequest()
        }
        break

      case TEMPERATURE:
        if (min < -100 || max > +100) {
          throw httpErrors.badRequest()
        }
        break
    }

    if (min > max) {
      throw httpErrors.badRequest()
    }
  }

  const typesSchema = {
    description: 'Получение списка типов умных устройств',
    tags: ['iot'],
    summary: 'Получение типов устройств',
    response: {
      200: {
        description: 'Типы устройств',
        type: 'array',
        items: {
          type: 'object',
          required: [
            'type',
            'title'
          ],
          additionalProperties: false,
          properties: {
            type: iotTypeSchema,
            title: {
              description: 'Название типа',
              type: 'string',
              minLength: 1
            }
          }
        }
      }
    }
  }

  app.get('/types', { schema: typesSchema }, function () {
    return [
      { type: LIGHTING, title: 'Освещение' },
      { type: HUMIDITY, title: 'Влажность' },
      { type: TEMPERATURE, title: 'Температура' }
    ]
  })

  const searchSchema = {
    description: 'Получение списка умных устройств',
    tags: ['iot'],
    summary: 'Получение устройств',
    querystring: {
      type: 'object',
      required: ['title'],
      additionalProperties: false,
      properties: {
        title: iotTitleSchema
      }
    },
    response: {
      200: {
        description: 'Устройства',
        type: 'array',
        items: iotResponseSchema
      }
    }
  }

  app.get('/search', { schema: searchSchema }, async function (request) {
    const { userId } = request
    const { title } = request.query

    const query = knex('iot')
      .where('title', 'ilike', `%${title}%`)
      .select('*')

    const sa = await utils.isSA(request, knex)

    if (!sa) {
      const iotsIds = knex('iot_owner')
        .where({ userId })
        .select('iotId')

      query.whereIn('iotId', iotsIds)
    }

    return query
  })

  const createSchema = {
    description: 'Создание умного устройства',
    tags: ['iot'],
    summary: 'Создание устройства',
    body: {
      type: 'object',
      required: [
        'title',
        'type',
        'hello',
        'min',
        'max'
      ],
      additionalProperties: false,
      properties: iotCreateSchema
    },
    response: {
      200: {
        description: 'Созданное устройство',
        ...iotResponseSchema
      }
    }
  }

  app.post('/create', { schema: createSchema }, async function (request) {
    const iotData = request.body
    const { type, min, max } = iotData

    asserSetting(type, min, max)

    const sa = await utils.isSA(request, knex)

    if (!sa) {
      throw httpErrors.forbidden()
    }

    const [iot] = await knex('iot')
      .insert(iotData)
      .returning('*')

    return iot
  })

  const updateSchema = {
    description: 'Обновление умного устройства',
    tags: ['iot'],
    summary: 'Обновление устройства',
    querystring: {
      type: 'object',
      required: ['iotId'],
      additionalProperties: false,
      properties: {
        iotId: iotIdSchema
      }
    },
    body: {
      type: 'object',
      minProperties: 1,
      additionalProperties: false,
      properties: iotUpdateSchema
    },
    response: {
      200: {
        description: 'Обновлённое устройство',
        ...iotResponseSchema
      }
    }
  }

  app.put('/update', { schema: updateSchema }, async function (request) {
    const { iotId } = request.query
    const iotData = request.body
    const { type, min, max } = iotData

    asserSetting(type, min, max)

    const [iot] = await knex('iot')
      .where({ iotId })
      .update(iotData)
      .returning('*')

    if (!iot) {
      throw httpErrors.notFound()
    }

    return iot
  })

  const deleteSchema = {
    description: 'Удаление умного устройства',
    tags: ['iot'],
    summary: 'Удаление устройства',
    querystring: {
      type: 'object',
      required: ['iotId'],
      additionalProperties: false,
      properties: {
        iotId: iotIdSchema
      }
    }
  }

  app.delete('/delete', { schema: deleteSchema }, async function (request) {
    const { iotId } = request.query

    const numberDeletedIots = await knex('iot')
      .where({ iotId })
      .del()

    if (!numberDeletedIots) {
      throw httpErrors.notFound()
    }
  })

  const ownerSetSchema = {
    description: 'Добавление в собственность умного устройства',
    tags: ['iot'],
    summary: 'Привязка устройства',
    querystring: {
      type: 'object',
      required: ['iotId'],
      additionalProperties: false,
      properties: {
        iotId: iotIdSchema
      }
    }
  }

  app.post('/owner/set', { schema: ownerSetSchema }, async function (request) {
    const { userId } = request
    const { iotId } = request.query

    await knex('iot_owner')
      .insert({
        userId,
        iotId
      })
  })

  const ownerDeleteSchema = {
    description: 'Удаление из собственности умного устройства',
    tags: ['iot'],
    summary: 'Отвязка устройства',
    querystring: {
      type: 'object',
      required: ['iotId'],
      additionalProperties: false,
      properties: {
        iotId: iotIdSchema
      }
    }
  }

  app.delete('/owner/delete', { schema: ownerDeleteSchema }, async function (request) {
    const { userId } = request
    const { iotId } = request.query

    const numberUpdated = await knex('iot_owner')
      .where({
        userId,
        iotId
      })
      .update('userId', null)

    if (!numberUpdated) {
      throw httpErrors.notFound()
    }
  })
}
