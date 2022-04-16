import React, {
  createContext,
  useContext,
  useState,
  useMemo,
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
  const [auth, setAuth] = useState(null)

  const isAuth = useMemo(() => auth?.isAuth ?? false, [auth])
  const rights = useMemo(() => auth?.rights ?? [], [auth])

  const init = useCallback(async () => {
    try {
      const auth = await AuthAPI.init()

      setAuth(auth)
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось проверить состояние аутентификации'
      })

      setAuth(null)
    }
  })

  const can = useCallback(
    (object, action) =>
      rights.some(
        (right) =>
          right.object === object &&
          right.action === action
      )
  )

  const logout = useCallback(async () => {
    try {
      await AuthAPI.logout()
    } catch {
      nofity({
        variant: 'error',
        message: 'Не удалось выйти из системы'
      })
    }

    init()
  })

  useEffect(() => {
    init()

    const checker = setInterval(init, 30 * 1000)

    return () => clearInterval(checker)
  }, [])

  if (auth === null) {
    return 'Загрузка...'
  }

  if (!isAuth) {
    return (
      <Router>
        <Switch>
          <Route path={'/login'}>
            <LogIn OnLogin={init} />
          </Route>
          <Route path={'/register'}>
            <Register OnRegister={init} />
          </Route>
          <Route path={'/restore'}>
            <Restore OnRestore={init} />
          </Route>

          <Redirect to={'/login'} />
        </Switch>
      </Router>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        rights,
        can,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

Auth.propTypes = {
  children: PropTypes.node
}
