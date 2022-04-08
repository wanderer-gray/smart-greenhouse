const jwt = require('jsonwebtoken')

function secret (sysSecret, ctxSecret) {
  return `${sysSecret}:${ctxSecret}`
}

function sign (payload, secret, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        return reject(err)
      }

      return resolve(token)
    })
  })
}

function verify (token, secret, error) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        return reject(error || err)
      }

      return resolve(payload)
    })
  })
}

async function tokenizer (fastify, options) {
  const sysSecret = options.secret

  fastify.decorate('tokenizer', {
    sign: (payload, ctxSecret, options) => sign(payload, secret(sysSecret, ctxSecret), options),
    verify: (token, ctxSecret, error) => verify(token, secret(sysSecret, ctxSecret), error)
  })
}

module.exports = require('fastify-plugin')(tokenizer)
