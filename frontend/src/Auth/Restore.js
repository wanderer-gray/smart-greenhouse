import React, {
  useState,
  useMemo,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import {
  Paper,
  Typography,
  TextField,
  Button,
  ButtonGroup
} from '@mui/material'

function RestoreFirstStep ({ email, setEmail, sendRestoreCode }) {
  return (
    <>
      <TextField
        sx={{ mb: 1 }}
        type={'email'}
        size={'small'}
        fullWidth={true}
        placeholder={'Почта'}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <Button
        sx={{ mb: 2 }}
        variant={'outlined'}
        fullWidth={true}
        onClick={sendRestoreCode}
      >
        Отправить код на почту
      </Button>
    </>
  )
}

RestoreFirstStep.propTypes = {
  email: PropTypes.string,
  setEmail: PropTypes.func,
  sendRestoreCode: PropTypes.func
}

function RestoreSecondStep ({ code, setCode, password, setPassword, restore }) {
  return (
    <>
      <TextField
        sx={{ mb: 1 }}
        size={'small'}
        fullWidth={true}
        placeholder={'Код'}
        value={code}
        onChange={(event) => setCode(event.target.value)}
      />
      <TextField
        sx={{ mb: 2 }}
        size={'small'}
        fullWidth={true}
        placeholder={'Пароль'}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <Button
        sx={{ mb: 2 }}
        variant={'outlined'}
        fullWidth={true}
        onClick={restore}
      >
        Восстановить
      </Button>
    </>
  )
}

RestoreSecondStep.propTypes = {
  code: PropTypes.string,
  setCode: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
  restore: PropTypes.func
}

export default function Restore ({ checkAuth }) {
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')

  const isStepFirst = useMemo(() => !token.length, [token])
  const isStepSecond = useMemo(() => !!token.length, [token])

  const sendRestoreCode = useCallback(async () => {
    try {
      const exists = await AuthAPI.existsEmail(email)

      if (!exists) {
        nofity({
          variant: 'warning',
          message: 'Данная почта не найдена'
        })

        return
      }
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось проверить почту на существование'
      })

      return
    }

    try {
      const token = await AuthAPI.sendRestoreCode(email)

      setToken(token)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось отправить код на почту'
      })
    }
  })

  const restore = useCallback(async () => {
    try {
      await AuthAPI.restore(token, code, password)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось восстановить пароль'
      })
    }

    return checkAuth()
  })

  return (
    <Paper
      sx={{
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        mx: 'auto',
        maxWidth: 480
      }}
    >
      <Typography
        variant={'h5'}
        sx={{ mb: 2 }}
      >
        Восстановление
      </Typography>

      {isStepFirst && (
        <RestoreFirstStep
          email={email}
          setEmail={setEmail}
          sendRestoreCode={sendRestoreCode}
        />
      )}

      {isStepSecond && (
        <RestoreSecondStep
          code={code}
          setCode={setCode}
          password={password}
          setPassword={setPassword}
          restore={restore}
        />
      )}

      <ButtonGroup
        size={'small'}
        variant={'text'}
        fullWidth={true}
      >
        <Button onClick={() => history.push('/login')}>
          Войти
        </Button>
        <Button onClick={() => history.push('/register')}>
          Регистрация
        </Button>
      </ButtonGroup>
    </Paper>
  )
}

Restore.propTypes = {
  checkAuth: PropTypes.func
}
