import React, {
  createContext,
  useState,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'

export const AuthContext = createContext()

export default function Auth ({ children }) {
  const [auth, setAuth] = useState(false)

  const check = useCallback(async () => {
    const auth = await AuthAPI.check()
      .catch(() => {
        nofity({ type: 'error', text: 'Не удалось проверить состояние аутентификации' })

        return false
      })

    setAuth(auth)
  })

  useEffect(() => {
    check()

    const checker = setInterval(check, 30 * 1000)

    return () => clearInterval(checker)
  })

  if (!auth) {
    return null
  }

  const logout = useCallback(async () => {
    try {
      await AuthAPI.logout()
    } catch {
      nofity({ type: 'error', text: 'Не удалось выйти из системы' })
    }

    return check()
  })

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  )
}

Auth.propTypes = {
  children: PropTypes.node
}
