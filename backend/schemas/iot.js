const enums = require('../enums')

const iotId = {
  description: 'Идентификатор устройства',
  type: 'string',
  format: 'uuid'
}

const title = {
  description: 'Название устройства',
  type: 'string',
  maxLength: 255
}

const type = {
  description: 'Тип устройства',
  type: 'integer',
  enum: Object.values(enums.iot)
}

const hello = {
  description: 'Таймер обновления',
  type: 'integer',
  minimum: 1, // 1 sec
  maximum: 30 * 60 // 30 min
}

const min = {
  description: 'Критический показатель минимума',
  type: 'integer'
}

const max = {
  description: 'Критический показатель максимума',
  type: 'integer'
}

const iot = {
  description: 'Умное устройство',
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
    iotId,
    title,
    type,
    hello,
    min,
    max
  }
}

module.exports = {
  iotId,
  title,
  type,
  hello,
  min,
  max,

  iot
}
