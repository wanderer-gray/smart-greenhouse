const crypto = require('crypto')

module.exports = {
  randomString: (size) =>
    new Promise((resolve, reject) => {
      crypto.randomBytes(size, (err, buffer) => {
        if (err) {
          return reject(err)
        }

        return resolve(buffer.toString('hex'))
      })
    }),

  randomStringSync: (size) =>
    crypto.randomBytes(size).toString('hex')
}
