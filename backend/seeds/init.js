const {
  sa: {
    email,
    password
  }
} = require('../config')[process.env.NODE_ENV || 'development']
const { user } = require('../enum')
const {
  getSalt,
  getHash
} = require('../utils')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  const salt = await getSalt()
  const hash = await getHash(password, salt)

  const [userId] = await knex('user')
    .insert({
      email,
      salt,
      hash
    })
    .onConflict('email')
    .merge()
    .returning('userId')

  await knex('setting')
    .insert({
      name: user.SA,
      value: userId
    })
    .onConflict('name')
    .merge()
}
