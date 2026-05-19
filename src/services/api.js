import axios from 'axios'

function normalizeBaseUrl(baseUrl) {
  const normalizedValue = (baseUrl || 'http://localhost:5089').trim().replace(/\/+$/, '')

  return normalizedValue.endsWith('/api')
    ? normalizedValue.slice(0, -4)
    : normalizedValue
}

const apiClient = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('drivecoreToken')

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getApiError(error) {
  const data = error.response?.data
  const status = error.response?.status

  if (!data) {
    return 'Could not connect to the API. Please check that the backend is running.'
  }

  if (data.message) {
    return Array.isArray(data.errors) && data.errors.length > 0
      ? `${data.message} ${data.errors.join(' ')}`
      : data.message
  }

  if (status === 401) {
    return 'You are not authorized. Please log in with the correct account.'
  }

  if (status === 403) {
    return 'You do not have permission to use this page.'
  }

  if (data.title && data.errors) {
    const validationErrors = Object.values(data.errors).flat().join(' ')
    return validationErrors || data.title
  }

  if (typeof data === 'string') {
    return data
  }

  return 'Something went wrong while calling the API.'
}

export const staffApi = {
  getAll: async () => {
    const response = await apiClient.get('/api/admin/staff')
    return response.data
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/admin/staff/${id}`)
    return response.data
  },
  create: async (staff) => {
    const response = await apiClient.post('/api/admin/staff', staff)
    return response.data
  },
  update: async (id, staff) => {
    const response = await apiClient.put(`/api/admin/staff/${id}`, staff)
    return response.data
  },
  updateRole: async (id, role) => {
    const response = await apiClient.put(`/api/admin/staff/${id}/role`, {
      role,
    })
    return response.data
  },
  updateStatus: async (id, isActive) => {
    const response = await apiClient.put(`/api/admin/staff/${id}/status`, {
      isActive,
    })
    return response.data
  },
}

function buildTemporaryPassword(email) {
  const namePart = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'User'
  const shortName = namePart.slice(0, 8)
  const suffix = Date.now().toString().slice(-6)

  return `${shortName}#${suffix}Aa`
}

export const customerApi = {
  createCustomer: async (customer, vehicle) => {
    const response = await apiClient.post('/api/staff/customers', {
      ...customer,
      password: buildTemporaryPassword(customer.email),
      vehicles: [vehicle],
    })

    const customerData = response.data
    const hasVehicle = Array.isArray(customerData.vehicles)
      ? customerData.vehicles.some(
        (item) => item.vehicleNumber === vehicle.vehicleNumber,
      )
      : false

    if (!hasVehicle && customerData.customerProfileId) {
      await customerApi.addVehicle(customerData.customerProfileId, vehicle)
    }

    return customerData.customerProfileId
      ? customerApi.getById(customerData.customerProfileId)
      : customerData
  },
  addVehicle: async (customerId, vehicle) => {
    const response = await apiClient.post(
      `/api/staff/customers/${customerId}/vehicles`,
      vehicle,
    )
    return response.data
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/staff/customers/${id}`)
    return response.data
  },
  getHistory: async () => {
    const response = await apiClient.get('/api/customer/me/history')
    return response.data
  },
}

export const partRequestApi = {
  create: async (request) => {
    const response = await apiClient.post('/api/partrequest', request)
    return response.data
  },
  getByCustomer: async (customerId) => {
    const response = await apiClient.get(`/api/partrequest/customer/${customerId}`)
    return response.data
  },
}

export const appointmentApi = {
  create: async (appointment) => {
    const response = await apiClient.post('/api/appointment', appointment)
    return response.data
  },
  getAll: async () => {
    const response = await apiClient.get('/api/appointment')
    return response.data
  },
}

export const reviewApi = {
  create: async (review) => {
    try {
      const response = await apiClient.post('/api/review', review)
      return response.data
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error
      }

      const response = await apiClient.post('/Review', review)
      return response.data
    }
  },
}

export const notificationApi = {
  getLowStock: async () => {
    const response = await apiClient.get('/api/notification/low-stock')
    return response.data
  },
  getUnreadCount: async () => {
    const response = await apiClient.get('/api/notification/low-stock/unread-count')
    return response.data
  },
  markAsRead: async (id) => {
    const response = await apiClient.put(`/api/notification/low-stock/${id}/read`)
    return response.data
  },
  markAllAsRead: async () => {
    const response = await apiClient.put('/api/notification/low-stock/mark-all-read')
    return response.data
  },
  delete: async (id) => {
    await apiClient.delete(`/api/notification/low-stock/${id}`)
  },
}

export const reportApi = {
  getDailyFinancial: async (date) => {
    const response = await apiClient.get('/api/admin/reports/financial/daily', {
      params: date ? { date } : {},
    })
    return response.data
  },
  getMonthlyFinancial: async (year, month) => {
    const response = await apiClient.get('/api/admin/reports/financial/monthly', {
      params: {
        ...(year ? { year } : {}),
        ...(month ? { month } : {}),
      },
    })
    return response.data
  },
  getYearlyFinancial: async (year) => {
    const response = await apiClient.get('/api/admin/reports/financial/yearly', {
      params: year ? { year } : {},
    })
    return response.data
  },
  getCustomerReports: async (topCount, overdueAfterDays) => {
    const response = await apiClient.get('/api/staff/reports/customers', {
      params: { topCount, overdueAfterDays },
    })
    return response.data
  },
}

export default apiClient
