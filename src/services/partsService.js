import apiClient from './api'

export async function getAllParts() {
  const response = await apiClient.get('/api/staff/sales/parts')
  return response.data
}

export async function createPart(part) {
  const response = await apiClient.post('/api/staff/sales/parts', part)
  return response.data
}
