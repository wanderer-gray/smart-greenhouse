const checkAuth = (request) => typeof request.userId === 'number'

module.exports = {
  checkAuth
}
