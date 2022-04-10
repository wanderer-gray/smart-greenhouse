import { Component } from 'react'
import PropTypes from 'prop-types'

export const AuthAPI = {
  check: () =>
    http('auth/check')
      .method('get'),

  existsEmail: (email) =>
    http('auth/existsEmail')
      .method('get')
      .query({ email }),

  login: (email, password) =>
    http('auth/login')
      .method('post')
      .body({
        email,
        password
      }),

  logout: () =>
    http('auth/login')
      .method('delete'),

  sendRestoreCode: (email) =>
    http('auth/sendRestoreCode')
      .method('post')
      .query({ email }),

  restore: (token, code, password) =>
    http('auth/restore')
      .method('put')
      .query({
        token,
        code
      })
      .body({ password }),

  sendRegisterCode: (email) =>
    http('auth/sendRegisterCode')
      .method('post')
      .query({ email }),

  register: (token, code, password) =>
    http('auth/register')
      .method('post')
      .query({
        token,
        code
      })
      .body({ password })
}

export default class Api extends Component {
  constructor (props) {
    super(props)

    window.AuthAPI = AuthAPI
  }

  render () {
    return this.props.children
  }
}

Api.propTypes = {
  children: PropTypes.node
}
