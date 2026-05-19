import api from './api'

export const getVendors = async () => {
  const response = await api.get('/vendors')
  return response.data
}

export const createVendor = async (payload) => {
  const response = await api.post('/vendors', payload)
  return response.data
}

export const updateVendor = async (id, payload) => {
  const response = await api.put(`/vendors/${id}`, payload)
  return response.data
}

export const deleteVendor = async (id) => {
  await api.delete(`/vendors/${id}`)
}
