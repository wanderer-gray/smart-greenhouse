const isAuth = {
  description: 'Аутентифицирован ли пользователь',
  type: 'boolean'
}

const right = {
  description: 'Права в системе',
  type: 'array',
  items: {
    type: 'object',
    required: [
      'object',
      'action'
    ],
    additionalProperties: false,
    properties: {
      object: {
        description: 'Объект',
        type: 'string'
      },
      action: {
        description: 'Действие',
        type: 'string'
      }
    }
  }
}

const code = {
  description: 'Код',
  type: 'integer',
  minimum: 10 ** 5,
  maximum: 10 ** 6 - 1
}

const token = {
  description: 'Токен',
  type: 'string'
}

module.exports = {
  isAuth,
  right,
  code,
  token
}
