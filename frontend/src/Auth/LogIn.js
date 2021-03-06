import React, {
  useState,
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

export default function LogIn ({ OnLogin }) {
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = useCallback(async () => {
    try {
      await AuthAPI.login(email, password)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось войти в систему'
      })
    }

    OnLogin()
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
        sx={{ mb: 2 }}
        variant={'h5'}
      >
        Войти в систему
      </Typography>

      <TextField
        sx={{ mb: 1 }}
        type={'email'}
        size={'small'}
        fullWidth={true}
        placeholder={'Почта'}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        sx={{ mb: 2 }}
        type={'password'}
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
        onClick={login}
      >
        Войти
      </Button>

      <ButtonGroup
        size={'small'}
        variant={'text'}
        fullWidth={true}
      >
        <Button onClick={() => history.push('/register')}>
          Регистрация
        </Button>
        <Button onClick={() => history.push('/restore')}>
          Восстановление
        </Button>
      </ButtonGroup>
    </Paper>
  )
}

LogIn.propTypes = {
  OnLogin: PropTypes.func.isRequired
}
