import React, {
  useState,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import { ModalEdit } from '../components'
import { TextField } from '@mui/material'

export default function AppendIotModal ({ open, onClose, onAppend }) {
  const [iotId, setIotId] = useState('')

  const clear = () => setIotId('')

  const append = useCallback(async () => {
    try {
      await IotsAPI.ownerSet(iotId)

      clear()
      onAppend()
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось добавить умное устройство'
      })
    }
  })

  return (
    <ModalEdit
      title={'Добавление умного устройства'}
      open={open}
      onClose={() => {
        clear()
        onClose()
      }}
      onSave={append}
    >
      <TextField
        size={'small'}
        fullWidth={true}
        placeholder={'Идентификатор устройства'}
        value={iotId}
        onChange={(event) => setIotId(event.target.value)}
      />
    </ModalEdit>
  )
}

AppendIotModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAppend: PropTypes.func
}
