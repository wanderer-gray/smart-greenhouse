import React, {
  createContext,
  useContext,
  useState,
  useMemo,
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
import { DivSpaceBetween } from '../components'
import Iots from './Iots'

const DashboardContext = createContext()

export function useDashboard () {
  return useContext(DashboardContext)
}

export default function Dashboard () {
  const auth = useAuth()

  const [page, setPage] = useState('iots')
  const [iotTypesList, setIotTypesList] = useState([])

  const iotTypesMap = useMemo(
    () =>
      Object.fromEntries(
        iotTypesList.map((iotType) => [iotType.type, iotType])
      ),
    [iotTypesList]
  )

  const loadIotTypes = useCallback(async () => {
    try {
      const iotTypes = await IotsAPI.types()

      setIotTypesList(iotTypes)
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
      <DivSpaceBetween sx={{ mb: 2 }}>
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

      <DashboardContext.Provider value={{ iotTypesList, iotTypesMap }}>
        {page === 'iots' && <Iots />}
      </DashboardContext.Provider>
    </Paper>
  )
}
