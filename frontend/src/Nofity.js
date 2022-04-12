import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  SnackbarProvider,
  withSnackbar
} from 'notistack'

class Nofity extends Component {
  constructor (props) {
    super(props)

    window.nofity = ({ message, variant }) => props.enqueueSnackbar(message, {
      variant
    })
  }

  render () {
    return this.props.children
  }
}

Nofity.propTypes = {
  children: PropTypes.node,
  enqueueSnackbar: PropTypes.func
}

const NofityWrapper = withSnackbar(Nofity)

export default function NofityProvider ({ children }) {
  return (
    <SnackbarProvider maxSnack={3}>
      <NofityWrapper>
        {children}
      </NofityWrapper>
    </SnackbarProvider>
  )
}

NofityProvider.propTypes = {
  children: PropTypes.node
}
