import { useCallback, useMemo, useState } from 'react'
import {
  clearAuth,
  getStoredAuth,
  loginUser,
  registerUser,
  saveAuth,
} from '../services/authService'
import { AuthContext } from './auth-context'

const allowedRoles = ['Admin', 'Staff', 'Customer']

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth())

  const login = useCallback(async (credentials) => {
    const authData = await loginUser(credentials)
    setAuth(authData)
    return authData
  }, [])

  const register = useCallback(async (registration) => {
    const authData = await registerUser(registration)
    setAuth(authData)
    return authData
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setAuth(null)
  }, [])

  const updateAuth = useCallback((authPatch) => {
    setAuth((currentAuth) => {
      if (!currentAuth) return currentAuth

      const nextAuth = {
        ...currentAuth,
        ...authPatch,
      }

      saveAuth(nextAuth)
      return nextAuth
    })
  }, [])

  const value = useMemo(
    () => {
      const hasValidRole = allowedRoles.includes(auth?.role)
      const isAuthenticated = Boolean(auth?.token && hasValidRole)

      return {
        auth,
        isAuthenticated,
        login,
        register,
        logout,
        updateAuth,
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
    [auth, login, register, logout, updateAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
