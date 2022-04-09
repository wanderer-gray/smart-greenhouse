const email = {
  description: 'Почта',
  type: 'string',
  format: 'email',
  maxLength: 255
}

const password = {
  description: 'Пароль',
  type: 'string',
  maxLength: 255
}

module.exports = {
  email,
  password
}
