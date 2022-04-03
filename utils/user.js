const crypto = require('crypto')

const { randomString } = require('./random')

const getSalt = () => randomString(16)

const getHash = (password, salt) =>
  new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 1024, 64, 'sha512', (err, buffer) => {
      if (err) {
        return reject(err)
      }

      return resolve(buffer.toString('hex'))
    })
  })

const checkHash = async (password, salt, hash) => await getHash(password, salt) === hash

module.exports = {
  getSalt,

  getHash,

  checkHash
}
