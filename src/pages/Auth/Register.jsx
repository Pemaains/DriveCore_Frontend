import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getApiError } from '../../services/api'

const emptyForm = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  address: '',
  vehicleNumber: '',
  brand: '',
  model: '',
  year: '',
  color: '',
}

function Register() {
  const navigate = useNavigate()
  const { isAuthenticated, register, user } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'Customer' ? '/customer/profile' : '/'} replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function validateForm() {
    if (!form.fullName.trim()) return 'Full name is required.'
    if (!form.email.trim()) return 'Email is required.'
    if (!form.phoneNumber.trim()) return 'Phone number is required.'
    if (!form.password) return 'Password is required.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    if (!form.address.trim()) return 'Address is required.'
    if (!form.vehicleNumber.trim()) return 'Vehicle number is required.'
    if (!form.brand.trim()) return 'Vehicle brand is required.'
    if (!form.model.trim()) return 'Vehicle model is required.'
    if (!form.year) return 'Vehicle year is required.'

    const year = Number(form.year)
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
      return
    }

    try {
      setLoading(true)
      setError('')

      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        address: form.address.trim(),
        vehicles: [
          {
            vehicleNumber: form.vehicleNumber.trim(),
            brand: form.brand.trim(),
            model: form.model.trim(),
            year: Number(form.year),
            color: form.color.trim(),
          },
        ],
      })

      navigate('/customer/profile', { replace: true })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page narrow-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">DriveCore</p>
          <h1>Customer Registration</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="panel form-stack" onSubmit={handleSubmit}>
        <section>
          <h2>Profile</h2>
          <div className="form-grid">
            <label>
              Full name
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </label>

            <label>
              Phone number
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </label>

            <label>
              Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                autoComplete="street-address"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </label>

            <label>
              Confirm password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </label>
          </div>
        </section>

        <section>
          <h2>First Vehicle</h2>
          <div className="form-grid">
            <label>
              Vehicle number
              <input
                type="text"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Brand
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Model
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
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
                value={form.year}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Color
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>

        <div className="form-actions">
          <Link className="secondary-button button-link" to="/login">
            Sign in
          </Link>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Register
