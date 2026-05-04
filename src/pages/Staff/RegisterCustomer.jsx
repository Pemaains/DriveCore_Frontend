import { useState } from 'react'
import { Link } from 'react-router-dom'
import { customerApi, getApiError } from '../../services/api'

const emptyCustomerForm = {
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
}

const emptyVehicleForm = {
  vehicleNumber: '',
  brand: '',
  model: '',
  year: '',
  color: '',
}

function RegisterCustomer() {
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm)
  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm)
  const [createdCustomer, setCreatedCustomer] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleCustomerChange(event) {
    const { name, value } = event.target
    setCustomerForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function handleVehicleChange(event) {
    const { name, value } = event.target
    setVehicleForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function validateForm() {
    if (!customerForm.fullName.trim()) return 'Customer full name is required.'
    if (!customerForm.email.trim()) return 'Customer email is required.'
    if (!customerForm.phoneNumber.trim()) return 'Customer phone number is required.'
    if (!customerForm.address.trim()) return 'Customer address is required.'
    if (!vehicleForm.vehicleNumber.trim()) return 'Vehicle number is required.'
    if (!vehicleForm.brand.trim()) return 'Vehicle brand is required.'
    if (!vehicleForm.model.trim()) return 'Vehicle model is required.'
    if (!vehicleForm.year) return 'Vehicle year is required.'
    if (!vehicleForm.color.trim()) return 'Vehicle color is required.'

    const year = Number(vehicleForm.year)
    if (Number.isNaN(year) || year < 1900 || year > 2100) {
      return 'Vehicle year must be between 1900 and 2100.'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setSuccess('')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')
      setCreatedCustomer(null)

      const customerPayload = {
        fullName: customerForm.fullName.trim(),
        email: customerForm.email.trim(),
        phoneNumber: customerForm.phoneNumber.trim(),
        address: customerForm.address.trim(),
      }

      const vehiclePayload = {
        vehicleNumber: vehicleForm.vehicleNumber.trim(),
        brand: vehicleForm.brand.trim(),
        model: vehicleForm.model.trim(),
        year: Number(vehicleForm.year),
        color: vehicleForm.color.trim(),
      }

      const registeredCustomer = await customerApi.createCustomer(
        customerPayload,
        vehiclePayload,
      )

      setCreatedCustomer(registeredCustomer)
      setSuccess('Customer and vehicle registered successfully.')
      setCustomerForm(emptyCustomerForm)
      setVehicleForm(emptyVehicleForm)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page narrow-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Customer Registration</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {createdCustomer?.customerProfileId && (
        <div className="details-strip">
          <span>Customer ID: {createdCustomer.customerProfileId}</span>
          <Link to={`/staff/customers/${createdCustomer.customerProfileId}`}>
            View details
          </Link>
        </div>
      )}

      <form className="panel form-stack" onSubmit={handleSubmit}>
        <section>
          <h2>Customer Information</h2>
          <div className="form-grid">
            <label>
              Full name
              <input
                type="text"
                name="fullName"
                value={customerForm.fullName}
                onChange={handleCustomerChange}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={customerForm.email}
                onChange={handleCustomerChange}
                required
              />
            </label>

            <label>
              Phone number
              <input
                type="tel"
                name="phoneNumber"
                value={customerForm.phoneNumber}
                onChange={handleCustomerChange}
                required
              />
            </label>

            <label>
              Address
              <textarea
                name="address"
                value={customerForm.address}
                onChange={handleCustomerChange}
                rows="3"
                required
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Vehicle Details</h2>
          <div className="form-grid">
            <label>
              Vehicle number
              <input
                type="text"
                name="vehicleNumber"
                value={vehicleForm.vehicleNumber}
                onChange={handleVehicleChange}
                required
              />
            </label>

            <label>
              Brand
              <input
                type="text"
                name="brand"
                value={vehicleForm.brand}
                onChange={handleVehicleChange}
                required
              />
            </label>

            <label>
              Model
              <input
                type="text"
                name="model"
                value={vehicleForm.model}
                onChange={handleVehicleChange}
                required
              />
            </label>

            <label>
              Year
              <input
                type="number"
                name="year"
                min="1900"
                max="2100"
                value={vehicleForm.year}
                onChange={handleVehicleChange}
                required
              />
            </label>

            <label>
              Color
              <input
                type="text"
                name="color"
                value={vehicleForm.color}
                onChange={handleVehicleChange}
                required
              />
            </label>
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? 'Submitting...' : 'Register Customer'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default RegisterCustomer
