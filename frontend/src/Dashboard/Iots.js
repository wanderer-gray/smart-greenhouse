import React, {
  useState,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../Auth'
import { useDashboard } from '.'
import { useDebounce } from '../utils'
import {
  Grid,
  Typography,
  TextField,
  Button
} from '@mui/material'
import { DivSpaceBetween } from '../components'
import CreateIotModal from './CreateIotModal'
import AppendIotModal from './AppendIotModal'
import IotCard from './IotCard'

function CreateIotButton ({ onCreate, ...props }) {
  const auth = useAuth()
  const dashboard = useDashboard()

  const [open, setOpen] = useState(false)

  if (!auth.can('iot', 'create')) {
    return null
  }

  return (
    <>
      <Button
        {...props}
        variant={'outlined'}
        onClick={() => setOpen(true)}
      >
        Создать
      </Button>
      <CreateIotModal
        typesList={dashboard.iotTypesList}
        open={open}
        onClose={() => setOpen(false)}
        onCreate={() => {
          setOpen(false)
          onCreate()
        }}
      />
    </>
  )
}

CreateIotButton.propTypes = {
  onCreate: PropTypes.func
}

function AppendIotButton ({ onAppend, ...props }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        {...props}
        size={'small'}
        color={'success'}
        variant={'outlined'}
        onClick={() => setOpen(true)}
      >
        Добавить
      </Button>
      <AppendIotModal
        open={open}
        onClose={() => setOpen(false)}
        onAppend={() => {
          setOpen(false)
          onAppend()
        }}
      />
    </>
  )
}

AppendIotButton.propTypes = {
  onAppend: PropTypes.func
}

export default function Iots () {
  const dashboard = useDashboard()

  const [iots, setIots] = useState([])
  const [title, setTitle] = useState('')

  const debouncedTitle = useDebounce(title, 500)

  const search = useCallback(async () => {
    try {
      const iots = await IotsAPI.search(debouncedTitle)

      setIots(iots)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось получить список устройств'
      })
    }
  })

  useEffect(search, [debouncedTitle])

  return (
    <>
      <DivSpaceBetween sx={{ mb: 2 }}>
        <CreateIotButton
          sx={{ mr: 2 }}
          onCreate={search}
        />

        <TextField
          size={'small'}
          fullWidth={true}
          placeholder={'Название'}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </DivSpaceBetween>

      <AppendIotButton
        sx={{ mb: 2 }}
        onAppend={search}
      />

      {!iots.length && (
        <Typography variant={'h5'}>
          Ничего не найдено
        </Typography>
      )}

      <Grid
        container={true}
        spacing={2}
      >
        {iots.map((iot) => (
          <Grid
            key={iot.iotId}
            item={true}
            xs={6}
          >
            <IotCard
              typesMap={dashboard.iotTypesMap}
              iot={iot}
              onUpdate={search}
              onOwnerDelete={search}
            />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
