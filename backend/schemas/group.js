const groupId = {
  description: 'Идентификатор группы',
  type: 'integer'
}

const title = {
  description: 'Название группы',
  type: 'string',
  maxLength: 255
}

const group = {
  description: 'Группа умных устройств',
  type: 'object',
  required: [
    'groupId',
    'title'
  ],
  additionalProperties: false,
  properties: {
    groupId,
    title
  }
}

module.exports = {
  groupId,
  title,

  group
}
