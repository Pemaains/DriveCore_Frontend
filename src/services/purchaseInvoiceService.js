import api from './api'

export const getPurchaseInvoices = async () => {
  const response = await api.get('/purchaseinvoices')
  return response.data
}

export const createPurchaseInvoice = async (payload) => {
  const response = await api.post('/purchaseinvoices', payload)
  return response.data
}
