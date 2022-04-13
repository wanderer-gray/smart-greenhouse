import { Component } from 'react'
import PropTypes from 'prop-types'
import { AuthAPI } from './AuthAPI'
import { IotsAPI } from './IotsAPI'

export default class Api extends Component {
  constructor (props) {
    super(props)

    window.AuthAPI = AuthAPI
    window.IotsAPI = IotsAPI
  }

  render () {
    return this.props.children
  }
}

Api.propTypes = {
  children: PropTypes.node
}
