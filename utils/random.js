const crypto = require('crypto')

const randomInt = (min, max) =>
  new Promise((resolve, reject) => {
    crypto.randomInt(min, max, (err, value) => {
      if (err) {
        return reject(err)
      }

      return resolve(value)
    })
  })

const randomCode = () => randomInt(10 ** 5, 10 ** 6)

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
  randomInt,

  randomCode,

  randomString,

  randomStringSync
}
