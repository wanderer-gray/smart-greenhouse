const crypto = require('crypto')

const { randomString } = require('./random')

const getSalt = () => randomString(16)

const getHash = (payload, salt) =>
  new Promise((resolve, reject) => {
    crypto.pbkdf2(payload, salt, 1024, 64, 'sha512', (err, buffer) => {
      if (err) {
        return reject(err)
      }

      return resolve(buffer.toString('hex'))
    })
  })

const checkHash = async (payload, salt, hash) => await getHash(payload, salt) === hash

module.exports = {
  getSalt,

  getHash,

  checkHash
}
