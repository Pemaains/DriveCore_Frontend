import apiClient from './api'

export const getAllParts = async () => {
  const response = await apiClient.get('/api/parts')
  return response.data
}

export const getParts = async (search = '') => {
  const response = await apiClient.get('/api/parts', { params: { search } })
  return response.data
}

export const createPart = async (payload) => {
  const response = await apiClient.post('/api/parts', payload)
  return response.data
}

export const updatePart = async (id, payload) => {
  const response = await apiClient.put(`/api/parts/${id}`, payload)
  return response.data
}

export const deletePart = async (id) => {
  await apiClient.delete(`/api/parts/${id}`)
}
