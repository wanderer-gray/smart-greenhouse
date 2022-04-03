const { randomStringSync } = require('./utils')

module.exports = {
  development: {
    server: {
      host: '127.0.0.1',
      port: 3080
    },
    knex: {
      client: 'postgresql',
      connection: {
        database: 'smart-greenhouse',
        user: 'test_user',
        password: 'test_password'
      },
      pool: {
        min: 1,
        max: 2
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    },
    cookie: {
      secret: randomStringSync(512)
    }
  }
}
