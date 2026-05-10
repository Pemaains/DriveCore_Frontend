import apiClient from './api'

const AUTH_STORAGE_KEY = 'drivecoreAuth'
const TOKEN_STORAGE_KEY = 'drivecoreToken'
const roleNames = ['Admin', 'Staff', 'Customer']
const allowedRoles = ['Admin', 'Staff', 'Customer']

function normalizeRole(role) {
  return typeof role === 'number' ? roleNames[role] : role
}

export async function loginUser(credentials) {
  const response = await apiClient.post('/api/auth/login', credentials)
  const authData = response.data

  saveAuth(authData)
  return authData
}

export async function registerUser(data) {
  const response = await apiClient.post('/api/auth/register', data)
  const authData = response.data

  saveAuth(authData)
  return authData
}

export function saveAuth(authData) {
  const normalizedAuthData = {
    ...authData,
    role: normalizeRole(authData.role),
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedAuthData))
  localStorage.setItem(TOKEN_STORAGE_KEY, normalizedAuthData.token)
}

export function getStoredAuth() {
  const authJson = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!authJson) {
    return null
  }

  try {
    const authData = JSON.parse(authJson)
    const normalizedAuthData = {
      ...authData,
      role: normalizeRole(authData.role),
    }

    if (!normalizedAuthData.token || !allowedRoles.includes(normalizedAuthData.role)) {
      clearAuth()
      return null
    }

    return normalizedAuthData
  } catch {
    clearAuth()
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem('token')
  localStorage.removeItem('authToken')
}
