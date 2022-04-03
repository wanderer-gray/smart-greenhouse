module.exports = (app, _, done) => {
  app.log.debug('Mount "auth"')

  app.get('/checkExistsEmail', require('./checkExistsEmail'))
  app.post('/login', require('./login'))
  app.delete('/logout', require('./logout'))
  // app.put('/restore', require('./restore'))
  // app.post('/register', require('./register'))

  done()
}
