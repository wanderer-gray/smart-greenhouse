const { user } = require('../enum')
const { existsKnex } = require('./knex')

const isSA = (userId, knex) => {
  const subQuery = knex('setting')
    .where({
      name: user.SA,
      value: userId
    })

  return existsKnex(subQuery, knex)
}

module.exports = {
  isSA
}
