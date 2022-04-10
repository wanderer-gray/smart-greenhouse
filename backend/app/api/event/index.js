module.exports = async function (app) {
  console.log('Mount "event"')

  const {
    utils,
    schemas,
    knex,
    httpErrors
  } = app

  const iotSearchSchema = {
    description: 'Поиск событий умного устройства',
    tags: ['iot', 'event'],
    summary: 'Поиск событий устройства',
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
        description: 'События умного устройства',
        type: 'array',
        items: {
          type: 'object',
          required: [
            'subject',
            'text',
            'createAt'
          ],
          additionalProperties: false,
          properties: {
            subject: schemas.event.subject,
            text: schemas.event.text,
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

    const createAt = knex('metric')
      .where('metricId', knex.ref('event.metricId'))
      .select('createAt')

    return knex('event')
      .whereExists((builder) => {
        builder
          .from('metric')
          .where('metricId', knex.ref('event.metricId'))
          .where({ iotId })
          .where('createAt', '>=', begin)
          .where('createAt', '<=', end)
      })
      .select('subject', 'text')
      .select({ createAt })
      .orderBy('createAt')
  })

  const groupSearchSchema = {
    description: 'Поиск событий группы умных устройств',
    tags: ['group', 'event'],
    summary: 'Поиск событий группы',
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
        description: 'События группы умных устройств',
        type: 'object',
        required: [
          'iotId',
          'title',
          'type',
          'events'
        ],
        additionalProperties: false,
        properties: {
          iotId: schemas.iot.iotId,
          title: schemas.iot.title,
          type: schemas.iot.type,
          events: {
            description: 'События умного устройства',
            type: 'array',
            items: {
              type: 'object',
              required: [
                'subject',
                'text',
                'createAt'
              ],
              additionalProperties: false,
              properties: {
                subject: schemas.event.subject,
                text: schemas.event.text,
                createAt: schemas.metric.createAt
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
    const createAt = knex('metric')
      .where('metricId', knex.ref('event.metricId'))
      .select('createAt')

    const event = knex('event')
      .whereExists((builder) => {
        builder
          .from('metric')
          .where('metricId', knex.ref('event.metricId'))
          .where('iotId', knex.ref('iot.iotId'))
          .where('createAt', '>=', begin)
          .where('createAt', '<=', end)
      })
      .select('subject', 'text')
      .select({ createAt })
      .orderBy('createAt')

    const events = knex({ event })
      .select(knex.raw('coalesce(jsonb_agg(event), \'[]\'::jsonb)'))

    return knex('iot')
      .whereExists((builder) => {
        builder
          .from('group_iot')
          .where('iotId', knex.ref('iot.iotId'))
          .where({ groupId })
      })
      .select('iotId', 'title', 'type')
      .select({ events })
      .orderBy('title')
  })
}
