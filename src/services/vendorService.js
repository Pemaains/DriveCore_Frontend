import api from './api'

export const getVendors = async () => {
  const response = await api.get('/api/vendors')
  return response.data
}

export const createVendor = async (payload) => {
  const response = await api.post('/api/vendors', payload)
  return response.data
}

export const updateVendor = async (id, payload) => {
  const response = await api.put(`/api/vendors/${id}`, payload)
  return response.data
}

export const deleteVendor = async (id) => {
  await api.delete(`/api/vendors/${id}`)
}
