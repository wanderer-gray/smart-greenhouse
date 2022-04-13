import React, {
  useState,
  useCallback,
  useEffect
} from 'react'
import { useDashboard } from '.'
import { useDebounce } from '../utils'
import {
  Typography,
  TextField,
  Button
} from '@mui/material'
import { styled } from '@mui/system'
import Iot from './Iot'

const DivSpaceBetween = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '16px',
  marginBottom: '16px'
})

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
      <DivSpaceBetween>
        <Button
          variant={'outlined'}
        >
          Создать
        </Button>

        <Button
          sx={{
            ml: 2
          }}
          color={'success'}
          variant={'outlined'}
        >
          Добавить
        </Button>

        <TextField
          sx={{
            ml: 2
          }}
          size={'small'}
          fullWidth={true}
          placeholder={'Название'}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </DivSpaceBetween>

      {!iots.length && (
        <Typography variant={'h5'}>
          Ничего не найдено
        </Typography>
      )}

      {iots.map(({ iotId, type, title, hello, min, max }) => {
        return (
          <Iot
            key={iotId}
            iotId={iotId}
            type={type}
            title={title}
            types={dashboard.iotTypes}
            hello={hello}
            min={min}
            max={max}
            onUpdate={search}
            onOwnerDelete={search}
          />
        )
      })}
    </>
  )
}
