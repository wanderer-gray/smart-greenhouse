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

const randomInt = (min, max) =>
  new Promise((resolve, reject) => {
    crypto.randomInt(min, max, (err, value) => {
      if (err) {
        return reject(err)
      }

      return resolve(value)
    })
  })

const randomToken = () => randomInt(10 ** 5, 10 ** 6)

module.exports = {
  randomString,

  randomStringSync,

  randomInt,

  randomToken
}
