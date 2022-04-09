module.exports = async function (app) {
  console.log('Mount "group"')

  const {
    utils,
    schemas,
    knex,
    httpErrors
  } = app

  const searchSchema = {
    description: 'Получение списка групп умных устройств',
    tags: ['group'],
    summary: 'Получение групп',
    querystring: {
      type: 'object',
      required: ['title'],
      additionalProperties: false,
      properties: {
        title: schemas.group.title
      }
    },
    response: {
      200: {
        description: 'Группы',
        type: 'array',
        items: {
          description: 'Группа умных устройств',
          type: 'object',
          required: [
            'groupId',
            'title',
            'iots'
          ],
          additionalProperties: false,
          properties: {
            groupId: schemas.group.groupId,
            title: schemas.group.title,
            iots: {
              type: 'array',
              items: schemas.iot.iot
            }
          }
        }
      }
    }
  }

  app.get('/search', { schema: searchSchema }, async function (request) {
    const { userId } = request
    const { title } = request.query

    const iot = knex('iot')
      .whereExists((builder) => {
        builder
          .from('group_iot')
          .where('groupId', knex.ref('group.groupId'))
          .where('iotId', knex.ref('iot.iotId'))
      })
      .select('*')
      .orderBy('title')

    return knex('group')
      .where({ userId })
      .where('title', 'ilike', `%${title}%`)
      .select([
        'groupId',
        'title',
        knex({ iot })
          .select(knex.raw('coalesce(jsonb_agg(iot), \'[]\'::jsonb)'))
          .as('iots')
      ])
      .orderBy('title')
  })

  const createSchema = {
    description: 'Создание группы умных устройств',
    tags: ['group'],
    summary: 'Создание группы устройств',
    body: {
      type: 'object',
      required: [
        'title'
      ],
      additionalProperties: false,
      properties: {
        title: schemas.group.title
      }
    },
    response: {
      200: schemas.group.group
    }
  }

  app.post('/create', { schema: createSchema }, async function (request) {
    const { userId } = request
    const groupData = request.body

    const [group] = await knex('group')
      .insert({
        ...groupData,
        userId
      })
      .returning('groupId', 'title')

    return group
  })

  const updateSchema = {
    description: 'Обновление группы умных устройств',
    tags: ['group'],
    summary: 'Обновление группы устройств',
    querystring: {
      type: 'object',
      required: ['groupId'],
      additionalProperties: false,
      properties: {
        groupId: schemas.group.groupId
      }
    },
    body: {
      type: 'object',
      required: [
        'title'
      ],
      additionalProperties: false,
      properties: {
        title: schemas.group.title
      }
    },
    response: {
      200: schemas.group.group
    }
  }

  app.put('/update', { schema: updateSchema }, async function (request) {
    const { userId } = request
    const { groupId } = request.query
    const groupData = request.body

    const [group] = await knex('group')
      .where({
        groupId,
        userId
      })
      .update(groupData)
      .returning('groupId', 'title')

    if (!group) {
      throw httpErrors.notFound()
    }

    return group
  })

  const deleteSchema = {
    description: 'Удаление группы умных устройств',
    tags: ['group'],
    summary: 'Удаление группы устройств',
    querystring: {
      type: 'object',
      required: ['groupId'],
      additionalProperties: false,
      properties: {
        groupId: schemas.group.groupId
      }
    }
  }

  app.delete('/delete', { schema: deleteSchema }, async function (request) {
    const { userId } = request
    const { groupId } = request.query

    const numberDeletedGroups = await knex('group')
      .where({
        groupId,
        userId
      })
      .del()

    if (!numberDeletedGroups) {
      throw httpErrors.notFound()
    }
  })

  const iotSetSchema = {
    description: 'Привязка умных устройств к группе',
    tags: ['group'],
    summary: 'Привязка умных устройств',
    body: {
      type: 'object',
      required: [
        'groupId',
        'iotsIds'
      ],
      additionalProperties: false,
      properties: {
        groupId: schemas.group.groupId,
        iotsIds: {
          type: 'array',
          items: schemas.iot.iotId
        }
      }
    },
    response: {
      200: {
        type: 'array',
        items: schemas.iot.iot
      }
    }
  }

  app.put('/iot/set', { schema: iotSetSchema }, function (request) {
    const { userId } = request
    const { groupId, iotsIds } = request.body

    return knex.transaction(async (trx) => {
      const myGroup = trx('group')
        .where({
          groupId,
          userId
        })

      const accessGroup = await utils.existsKnex(myGroup, trx)

      if (!accessGroup) {
        throw httpErrors.forbidden()
      }

      const myIots = trx('iot_owner')
        .where({ userId })
        .whereIn('iotId', iotsIds)
        .count()
        .having('count', '=', iotsIds.length)

      const accessIots = await utils.existsKnex(myIots, trx)

      if (!accessIots) {
        throw httpErrors.forbidden()
      }

      await trx('group_iot')
        .where({ groupId })
        .whereNotIn('iotId', iotsIds)
        .del()

      const groupIots = iotsIds.map((iotId) => {
        return {
          iotId,
          groupId
        }
      })

      if (groupIots.length) {
        await trx('group_iot')
          .inser(groupIots)
      }

      return trx('iot')
        .whereIn('iotId', iotsIds)
        .select('*')
        .orderBy('title')
    })
  })
}
