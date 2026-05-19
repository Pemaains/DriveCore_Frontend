import apiClient from './api'

function mapPartPayload(payload = {}) {
  return {
    Name: payload.name?.trim() || '',
    PartNumber: payload.partNumber?.trim() || '',
    Description: payload.description?.trim() || '',
    UnitPrice: Number(payload.unitPrice ?? 0),
    StockQuantity: Number(payload.stockQuantity ?? 0),
    ReorderLevel: Number(payload.reorderLevel ?? 0),
    PreferredVendorId: payload.preferredVendorId ? Number(payload.preferredVendorId) : null,
  }
}

export const getAllParts = async () => {
  const response = await apiClient.get('/api/parts')
  return response.data
}

export const getParts = async (search = '') => {
  const response = await apiClient.get('/api/parts', { params: { search } })
  return response.data
}

export const createPart = async (payload) => {
  const response = await apiClient.post('/api/parts', mapPartPayload(payload))
  return response.data
}

export const updatePart = async (id, payload) => {
  const response = await apiClient.put(`/api/parts/${id}`, mapPartPayload(payload))
  return response.data
}

export const deletePart = async (id) => {
  await apiClient.delete(`/api/parts/${id}`)
}
