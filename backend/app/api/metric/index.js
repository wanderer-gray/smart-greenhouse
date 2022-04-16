module.exports = async function (app) {
  console.log('Mount "api_metric"')

  const {
    utils,
    schemas,
    knex,
    httpErrors
  } = app

  const iotSearchSchema = {
    description: 'Поиск метрик умного устройства',
    tags: ['iot', 'metric'],
    summary: 'Поиск метрик устройства',
    querystring: {
      type: 'object',
      required: [
        'iotId',
        'begin',
        'end'
      ],
      additionalProperties: false,
      properties: {
        iotId: schemas.iot.iotId,
        begin: schemas.metric.begin,
        end: schemas.metric.end
      }
    },
    response: {
      200: {
        description: 'Метрики умного устройства',
        type: 'array',
        items: {
          type: 'object',
          required: [
            'value',
            'createAt'
          ],
          additionalProperties: false,
          properties: {
            value: schemas.metric.value,
            createAt: schemas.metric.createAt
          }
        }
      }
    }
  }

  app.get('/iot/search', { schema: iotSearchSchema }, async function (request) {
    const { userId } = request
    const { iotId, begin, end } = request.query

    const myIot = knex('iot_owner')
      .where({
        userId,
        iotId
      })

    const access = await utils.existsKnex(myIot, knex)

    if (!access) {
      throw httpErrors.forbidden()
    }

    return knex('metric')
      .where({ iotId })
      .where('createAt', '>=', begin)
      .where('createAt', '<=', end)
      .select('value', 'createAt')
      .orderBy('createAt')
  })

  const groupSearchSchema = {
    description: 'Поиск метрик группы умных устройств',
    tags: ['group', 'metric'],
    summary: 'Поиск метрик группы',
    querystring: {
      type: 'object',
      required: [
        'groupId',
        'begin',
        'end'
      ],
      additionalProperties: false,
      properties: {
        groupId: schemas.group.groupId,
        begin: schemas.metric.begin,
        end: schemas.metric.end
      }
    },
    response: {
      200: {
        description: 'Метрики группы умных устройств',
        type: 'array',
        items: {
          type: 'object',
          required: [
            'iotId',
            'title',
            'type',
            'metrics'
          ],
          additionalProperties: false,
          properties: {
            iotId: schemas.iot.iotId,
            title: schemas.iot.title,
            type: schemas.iot.type,
            metrics: {
              description: 'Метрики умного устройства',
              type: 'array',
              items: {
                type: 'object',
                required: [
                  'value',
                  'createAt'
                ],
                additionalProperties: false,
                properties: {
                  value: schemas.metric.value,
                  createAt: schemas.metric.createAt
                }
              }
            }
          }
        }
      }
    }
  }

  app.get('/group/search', { schema: groupSearchSchema }, async function (request) {
    const { userId } = request
    const { groupId, begin, end } = request.query

    const myGroup = knex('group')
      .where({
        userId,
        groupId
      })

    const access = await utils.existsKnex(myGroup, knex)

    if (!access) {
      throw httpErrors.forbidden()
    }

    const metric = knex('metric')
      .where('iotId', knex.ref('iot.iotId'))
      .where('createAt', '>=', begin)
      .where('createAt', '<=', end)
      .select('value', 'createAt')
      .orderBy('createAt')

    const metrics = knex({ metric })
      .select(knex.raw('coalesce(jsonb_agg(metric), \'[]\'::jsonb)'))

    return knex('iot')
      .whereExists((builder) => {
        builder
          .from('group_iot')
          .where('iotId', knex.ref('iot.iotId'))
          .where({ groupId })
      })
      .select('iotId', 'title', 'type')
      .select({ metrics })
      .orderBy('title')
  })
}
