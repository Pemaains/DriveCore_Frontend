import api from './api'

export const getPurchaseInvoices = async () => {
  const response = await api.get('/api/purchaseinvoices')
  return response.data
}

export const createPurchaseInvoice = async (payload) => {
  const response = await api.post('/api/purchaseinvoices', payload)
  return response.data
}
