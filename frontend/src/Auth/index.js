import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import LogIn from './LogIn'
import Register from './Register'
import Restore from './Restore'

const AuthContext = createContext()

export function useAuth () {
  return useContext(AuthContext)
}

export default function Auth ({ children }) {
  const [ready, setReady] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  const check = useCallback(async () => {
    try {
      const auth = await AuthAPI.check()

      setIsAuth(auth)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось проверить состояние аутентификации'
      })

      setIsAuth(false)
    }

    setReady(true)
  })

  const logout = useCallback(async () => {
    try {
      await AuthAPI.logout()
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось выйти из системы'
      })
    }

    return check()
  })

  useEffect(() => {
    check()

    const checker = setInterval(check, 30 * 1000)

    return () => clearInterval(checker)
  })

  if (!ready) {
    return 'Загрузка...'
  }

  if (!isAuth) {
    return (
      <Router>
        <Switch>
          <Route path={'/login'}>
            <LogIn checkAuth={check} />
          </Route>
          <Route path={'/register'}>
            <Register checkAuth={check} />
          </Route>
          <Route path={'/restore'}>
            <Restore checkAuth={check} />
          </Route>

          <Redirect to={'/login'} />
        </Switch>
      </Router>
    )
  }

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  )
}

Auth.propTypes = {
  children: PropTypes.node
}
