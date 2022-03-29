const {
  randomString,
  randomStringSync
} = require('./random')

const {
  getSalt,
  getHash,
  checkHash
} = require('./hash')

module.exports = {
  randomString,
  randomStringSync,
  getSalt,
  getHash,
  checkHash
}
