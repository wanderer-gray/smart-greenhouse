const host = '127.0.0.1'
const port = 3080

module.exports = {
  development: {
    sa: {
      email: 'admin@smart-greenhouse.com',
      password: '123456'
    },
    oas: {
      routePrefix: '/documentation',
      swagger: {
        info: {
          title: 'smart-greenhouse',
          description: 'ТюмГУ, ИВ, МЛР, 22 ИБАС 188',
          version: '1.0.0'
        },
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        servers: [{
          url: `http://${host}:${port}`,
          description: 'Local server'
        }],
        tags: [
          { name: 'auth', description: 'Аутентификация' },
          { name: 'iot', description: 'Интернет вещей' },
          { name: 'group', description: 'Группы интернет вещей' },
          { name: 'metric', description: 'Метрики интернет вещей' },
          { name: 'event', description: 'События интернет вещей' },
          { name: 'other', description: 'Другое' }
        ]
      },
      exposeRoute: true
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
    cookie: {
      secret: 'test_secret'
    },
    tokenizer: {
      secret: 'test_secret'
    },
    server: {
      host,
      port
    }
  }
}
