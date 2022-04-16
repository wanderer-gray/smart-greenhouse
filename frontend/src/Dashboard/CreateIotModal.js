import React, {
  useState,
  useMemo,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import { iotUtils } from '../utils'
import { ModalEdit } from '../components'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Slider
} from '@mui/material'

export default function CreateIotModal ({ typesList, open, onClose, onCreate }) {
  const [iot, setIot] = useState({})

  const type = useMemo(() => iot.type ?? '', [iot])

  const limits = iotUtils.getLimits(type)

  const title = useMemo(() => iot.title ?? '', [iot])
  const hello = useMemo(() => iot.hello ?? limits.hello.min, [iot])
  const min = useMemo(() => iot.min ?? limits.min, [iot])
  const max = useMemo(() => iot.max ?? limits.max, [iot])

  const clear = () => setIot({})

  const create = useCallback(async () => {
    if (!type) {
      nofity({
        variant: 'warning',
        message: 'Необходимо указать тип устройства'
      })

      return
    }

    try {
      await IotsAPI.create(type, title, hello, min, max)

      clear()
      onCreate()
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось создать умное устройство'
      })
    }
  })

  const setIotProps = (props) => setIot({
    ...iot,
    ...props
  })

  return (
    <ModalEdit
      title={'Создание умного устройства'}
      open={open}
      onClose={() => {
        clear()
        onClose()
      }}
      onSave={create}
    >
      <FormControl
        size={'small'}
        fullWidth={true}
      >
        <InputLabel id={'model-create-iot-select-label'}>Тип устройства</InputLabel>
        <Select
          labelId={'model-create-iot-select-label'}
          label={'Тип устройства'}
          value={type}
          onChange={(event) => setIot({ type: event.target.value })}
        >
          {typesList.map(({ type, title }) => (
            <MenuItem
              key={type}
              value={type}
            >
              {title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {type && (
        <>
          <TextField
            sx={{ mt: 1 }}
            size={'small'}
            fullWidth={true}
            placeholder={'Название'}
            value={title}
            onChange={(event) => setIotProps({ title: event.target.value })}
          />

          <Typography sx={{ mt: 1 }}>
            Таймер обновления {hello} (сек)
          </Typography>
          <Slider
            min={limits.hello.min}
            max={limits.hello.max}
            value={hello}
            onChange={(_, hello) => setIotProps({ hello })}
          />

          <Typography sx={{ mt: 1 }}>
            Критический показатель минимума {min}
          </Typography>
          <Typography>
            Критический показатель максимума {max}
          </Typography>
          <Slider
            min={limits.min}
            max={limits.max}
            value={[min, max]}
            onChange={(_, [min, max]) => setIotProps({ min, max })}
          />
        </>
      )}
    </ModalEdit>
  )
}

CreateIotModal.propTypes = {
  typesList: PropTypes.array,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func
}
