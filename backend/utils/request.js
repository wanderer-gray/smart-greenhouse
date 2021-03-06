const { user } = require('../enums')
const { existsKnex } = require('./knex')

const checkAuth = (request) => typeof request.userId === 'number'

const isSA = (request, knex) => {
  const subQuery = knex('setting')
    .where({
      name: user.SA,
      value: request.userId
    })

  return existsKnex(subQuery, knex)
}

module.exports = {
  checkAuth,
  isSA
}
