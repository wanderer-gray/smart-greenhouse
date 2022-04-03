const crypto = require('crypto')

const { randomString } = require('./random')
const { existsKnex } = require('./knex')

const getSalt = () => randomString(16)

const getHash = (password, salt) =>
  new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 1024, 32, 'sha512', (err, buffer) => {
      if (err) {
        return reject(err)
      }

      return resolve(buffer.toString('hex'))
    })
  })

const checkHash = async (password, salt, hash) => await getHash(password, salt) === hash

const existsUserByEmail = (email, knex) => {
  const subQuery = knex('user')
    .where({ email })

  return existsKnex(subQuery, knex)
}

module.exports = {
  getSalt,

  getHash,

  checkHash,

  existsUserByEmail
}
