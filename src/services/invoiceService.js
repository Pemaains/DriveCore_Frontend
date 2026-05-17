import apiClient from './api'

export async function createSalesInvoice(invoice) {
  const response = await apiClient.post('/api/staff/sales/invoices', invoice)
  return response.data
}

export async function getInvoiceById(id) {
  const response = await apiClient.get(`/api/staff/sales/invoices/${id}`)
  return response.data
}

export async function sendInvoiceEmail(id) {
  const response = await apiClient.post(`/api/staff/sales/invoices/${id}/send`)
  return response.data
}
