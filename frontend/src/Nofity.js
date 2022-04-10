import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Snackbar, Alert } from '@mui/material'

export default class Nofity extends Component {
  constructor (props) {
    super(props)

    this.state = {
      queue: []
    }

    window.nofity = ({ type, text }) => {
      this.setState((state) => {
        const key = `${Date.now()}:${Math.random()}`

        const queue = [...state.queue, { type, text, key }]

        return { queue }
      })
    }
  }

  handleClose (key) {
    this.setState((state) => {
      const queue = state.queue.filter((nofity) => nofity.key !== key)

      return { queue }
    })
  }

  get nofity () {
    const nofity = this.state.queue[0]

    if (!nofity) {
      return null
    }

    const { key, type, text } = nofity

    setTimeout(() => this.handleClose(key), 5 * 1000)

    return (
      <Snackbar open={true}>
        <Alert
          severity={type}
          elevation={6}
          onClose={() => this.handleClose(key)}
        >
          {text}
        </Alert>
      </Snackbar>
    )
  }

  render () {
    return (
      <Fragment>
        {this.nofity}

        {this.props.children}
      </Fragment>
    )
  }
}

Nofity.propTypes = {
  children: PropTypes.node
}
