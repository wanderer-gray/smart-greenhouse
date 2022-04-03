const { randomStringSync } = require('./utils')

module.exports = {
  development: {
    server: {
      host: '127.0.0.1',
      port: 3080
    },
    cookie: {
      secret: randomStringSync(512)
    },
    knex: {
      client: 'postgresql',
      connection: {
        host: '192.168.111.160',
        port: 5432,
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
    mailer: {
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: undefined,
        pass: undefined
      }
    }
  }
}
