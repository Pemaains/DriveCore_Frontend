import apiClient from './api'

export async function getCustomerDetails(id) {
  const response = await apiClient.get(`/api/staff/customers/${id}/details`)
  return response.data
}
