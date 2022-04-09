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
  code,
  token
}
