import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react'
import { useAuth } from '../Auth'
import {
  Paper,
  Tabs,
  Tab,
  Button
} from '@mui/material'
import { styled } from '@mui/system'
import Iots from './Iots'

const DashboardContext = createContext()

export function useDashboard () {
  return useContext(DashboardContext)
}

const DivSpaceBetween = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export default function Dashboard () {
  const auth = useAuth()

  const [page, setPage] = useState('iots')
  const [iotTypes, setIotTypes] = useState([])

  const loadIotTypes = useCallback(async () => {
    try {
      const types = await IotsAPI.types()

      const iotTypes = Object.fromEntries(
        types.map((type) => [type.type, type])
      )

      setIotTypes(iotTypes)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось получить типы устройств'
      })
    }
  })

  useEffect(loadIotTypes, [])

  return (
    <Paper
      sx={{
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        mx: 'auto',
        maxWidth: 960
      }}
    >
      <DivSpaceBetween>
        <Tabs
          variant={'scrollable'}
          value={page}
        >
          <Tab
            value={'iots'}
            label={'Устройства'}
            onClick={() => setPage('iots')}
          />
          <Tab
            value={'groups'}
            label={'Группы'}
            onClick={() => setPage('groups')}
          />
        </Tabs>

        <Button
          color={'error'}
          variant={'outlined'}
          onClick={auth.logout}
        >
          Выйти
        </Button>
      </DivSpaceBetween>

      <DashboardContext.Provider value={{ iotTypes }}>
        {page === 'iots' && <Iots />}
      </DashboardContext.Provider>
    </Paper>
  )
}
