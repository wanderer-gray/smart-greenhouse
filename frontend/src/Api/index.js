import { Component } from 'react'
import PropTypes from 'prop-types'
import { AuthAPI } from './AuthAPI'

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
