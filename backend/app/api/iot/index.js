module.exports = async function (app) {
  console.log('Mount "iot"')

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
    httpErrors
  } = app

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
            type: schemas.iot.type,
            title: {
              description: 'Название типа',
              type: 'string'
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
        title: schemas.iot.title
      }
    },
    response: {
      200: {
        description: 'Устройства',
        type: 'array',
        items: schemas.iot.iot
      }
    }
  }

  app.get('/search', { schema: searchSchema }, async function (request) {
    const { userId } = request
    const { title } = request.query

    const query = knex('iot')
      .where('title', 'ilike', `%${title}%`)
      .select('*')
      .orderBy('iotId')

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
      properties: {
        type: schemas.iot.type,
        title: schemas.iot.title,
        hello: schemas.iot.hello,
        min: schemas.iot.min,
        max: schemas.iot.max
      }
    },
    response: {
      200: schemas.iot.iot
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
        iotId: schemas.iot.iotId
      }
    },
    body: {
      type: 'object',
      required: [
        'title',
        'hello',
        'min',
        'max'
      ],
      additionalProperties: false,
      properties: {
        title: schemas.iot.title,
        hello: schemas.iot.hello,
        min: schemas.iot.min,
        max: schemas.iot.max
      }
    },
    response: {
      200: schemas.iot.iot
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
        iotId: schemas.iot.iotId
      }
    }
  }

  app.delete('/delete', { schema: deleteSchema }, async function (request, reply) {
    const { iotId } = request.query

    const numberDeletedIots = await knex('iot')
      .where({ iotId })
      .del()

    if (!numberDeletedIots) {
      throw httpErrors.notFound()
    }

    reply.send()
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
        iotId: schemas.iot.iotId
      }
    }
  }

  app.post('/owner/set', { schema: ownerSetSchema }, async function (request, reply) {
    const { userId } = request
    const { iotId } = request.query

    await knex('iot_owner')
      .insert({
        userId,
        iotId
      })

    reply.send()
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
        iotId: schemas.iot.iotId
      }
    }
  }

  app.delete('/owner/delete', { schema: ownerDeleteSchema }, async function (request, reply) {
    const { userId } = request
    const { iotId } = request.query

    const numberDeleted = await knex('iot_owner')
      .where({
        userId,
        iotId
      })
      .del()

    if (!numberDeleted) {
      throw httpErrors.notFound()
    }

    reply.send()
  })
}
