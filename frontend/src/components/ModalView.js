import React from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function ModalEdit ({ children, open, title, onClose }) {
  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2
        }}
      >
        {title}
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers={true}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

ModalEdit.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func
}
