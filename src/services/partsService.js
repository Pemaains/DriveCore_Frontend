import apiClient from './api'

export async function getAllParts() {
  const response = await apiClient.get('/parts', { params: { search } })
  return response.data
}

// export async function createPart(part) {
//   const response = await apiClient.post('/api/staff/sales/parts', part)
//   return response.data
// }
export const getParts = async (search = '') => {
  const response = await apiClient.get('/parts', { params: { search } })
  return response.data

  const loadParts = async (searchTerm = '') => {
  const data = await getParts(searchTerm)
  console.log("RAW API RESPONSE:", data)
  setParts(data)
}
}

export const createPart = async (payload) => {
  const response = await apiClient.post('/parts', payload)
  return response.data
}

export const updatePart = async (id, payload) => {
  const response = await apiClient.put(`/parts/${id}`, payload)
  return response.data
}

export const deletePart = async (id) => {
  await apiClient.delete(`/parts/${id}`)
}
