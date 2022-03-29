const crypto = require('crypto')

const randomString = (size) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, buffer) => {
      if (err) {
        return reject(err)
      }

      return resolve(buffer.toString('hex'))
    })
  })

const randomStringSync = (size) => crypto.randomBytes(size).toString('hex')

module.exports = {
  randomString,

  randomStringSync
}
