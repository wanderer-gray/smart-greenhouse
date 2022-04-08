module.exports = async function (app) {
  console.log('Mount "group"')

  const {
    utils,
    knex,
    httpErrors
  } = app

  const groupIdSchema = {
    description: 'Идентификатор группы',
    type: 'integer'
  }
  const groupTitleSchema = {
    description: 'Название группы',
    type: 'string',
    maxLength: 255
  }
  const groupDataSchema = {
    title: groupTitleSchema
  }
  const groupResponseSchema = {
    type: 'object',
    required: [
      'groupId',
      'title'
    ],
    additionalProperties: false,
    properties: {
      groupId: groupIdSchema,
      ...groupDataSchema
    }
  }

  const createSchema = {
    description: 'Создание группы умных устройств',
    tags: ['iot'],
    summary: 'Создание группы устройств',
    body: {
      type: 'object',
      required: [
        'title'
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
}
