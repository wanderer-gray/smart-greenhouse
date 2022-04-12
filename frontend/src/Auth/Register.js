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

function RegisterFirstStep ({ email, setEmail, sendRegisterCode }) {
  return (
    <>
      <TextField
        sx={{ mb: 1 }}
        type={'email'}
        size={'small'}
        fullWidth={true}
        placeholder={'Email'}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <Button
        sx={{ mb: 2 }}
        variant={'outlined'}
        fullWidth={true}
        onClick={sendRegisterCode}
      >
        Отправить код на почту
      </Button>
    </>
  )
}

RegisterFirstStep.propTypes = {
  email: PropTypes.string,
  setEmail: PropTypes.func,
  sendRegisterCode: PropTypes.func
}

function RegisterSecondStep ({ code, setCode, password, setPassword, register }) {
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
        onClick={register}
      >
        Зарегестрироваться
      </Button>
    </>
  )
}

RegisterSecondStep.propTypes = {
  code: PropTypes.string,
  setCode: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
  register: PropTypes.func
}

export default function Register ({ checkAuth }) {
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')

  const isStepFirst = useMemo(() => !token.length, [token])
  const isStepSecond = useMemo(() => !!token.length, [token])

  const sendRegisterCode = useCallback(async () => {
    try {
      const exists = await AuthAPI.existsEmail(email)

      if (exists) {
        nofity({
          variant: 'warning',
          message: 'Данная почта уже занята'
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
      const token = await AuthAPI.sendRegisterCode(email)

      setToken(token)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось отправить код на почту'
      })
    }
  })

  const register = useCallback(async () => {
    try {
      await AuthAPI.register(token, code, password)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось зарегестрироваться'
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
        Регистрация
      </Typography>

      {isStepFirst && (
        <RegisterFirstStep
          email={email}
          setEmail={setEmail}
          sendRegisterCode={sendRegisterCode}
        />
      )}

      {isStepSecond && (
        <RegisterSecondStep
          code={code}
          setCode={setCode}
          password={password}
          setPassword={setPassword}
          register={register}
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
        <Button onClick={() => history.push('/restore')}>
          Восстановление
        </Button>
      </ButtonGroup>
    </Paper>
  )
}

Register.propTypes = {
  checkAuth: PropTypes.func
}
