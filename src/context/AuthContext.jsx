import { useCallback, useMemo, useState } from 'react'
import { clearAuth, getStoredAuth, loginUser } from '../services/authService'
import { AuthContext } from './auth-context'

const allowedRoles = ['Admin', 'Staff', 'Customer']

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth())

  const login = useCallback(async (credentials) => {
    const authData = await loginUser(credentials)
    setAuth(authData)
    return authData
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setAuth(null)
  }, [])

  const value = useMemo(
    () => {
      const hasValidRole = allowedRoles.includes(auth?.role)
      const isAuthenticated = Boolean(auth?.token && hasValidRole)

      return {
        auth,
        isAuthenticated,
        login,
        logout,
        user: isAuthenticated
          ? {
              userId: auth.userId,
              fullName: auth.fullName,
              email: auth.email,
              role: auth.role,
            }
          : null,
      }
    },
    [auth, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
