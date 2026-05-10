import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getApiError } from '../../services/api'

const roleHomePaths = {
  Admin: '/admin/dashboard',
  Staff: '/staff/dashboard',
  Customer: '/customer/dashboard',
}

function getHomePath(role) {
  return roleHomePaths[role] || '/login'
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, user } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={getHomePath(user?.role)} replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const authData = await login({
        email: form.email.trim(),
        password: form.password,
      })

      const fallbackPath = getHomePath(authData.role)
      const redirectPath = location.state?.from?.pathname || fallbackPath

      navigate(redirectPath === '/login' ? fallbackPath : redirectPath, {
        replace: true,
      })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page auth-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">DriveCore</p>
          <h1>Sign in</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="panel auth-panel" onSubmit={handleSubmit}>
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
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </label>

        <div className="form-actions">
          <p className="muted" style={{ textAlign: 'center', marginTop: '12px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'inherit', fontWeight: '600' }}>
              Create one
            </Link>
          </p>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default Login
