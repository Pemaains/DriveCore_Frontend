import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getApiError } from '../../services/api'

const emptyForm = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
}

function Register() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(event) {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    function validateForm() {
        if (!form.fullName.trim()) return 'Full name is required.'
        if (!form.email.trim()) return 'Email is required.'
        if (!form.phoneNumber.trim()) return 'Phone number is required.'
        if (form.password.length < 6) return 'Password must be at least 6 characters.'
        if (form.password !== form.confirmPassword) return 'Passwords do not match.'
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
            })

            navigate('/customer/dashboard', { replace: true })
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
                    <h1>Create Account</h1>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form className="panel auth-panel" onSubmit={handleSubmit}>
                <label>
                    Full Name
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
                    Phone Number
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
                    Confirm Password
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </label>

                <div className="form-actions">
                    <button type="submit" className="primary-button" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </div>

                <p className="muted" style={{ textAlign: 'center', marginTop: '12px' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'inherit', fontWeight: '600' }}>
                        Sign in
                    </Link>
                </p>
            </form>
        </section>
    )
}

export default Register