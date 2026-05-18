import { useState } from 'react'
import { getApiError } from '../../services/api'
import apiClient from '../../services/api'

function EmailReminder() {
    const [form, setForm] = useState({
        toEmail: '',
        toName: '',
        amountOwed: '',
        dueDate: ''
    })
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            await apiClient.post('/api/notification/send-credit-reminder', {
                toEmail: form.toEmail.trim(),
                toName: form.toName.trim(),
                amountOwed: Number(form.amountOwed),
                dueDate: new Date(form.dueDate).toISOString()
            })
            setSuccess(`Reminder email sent successfully to ${form.toEmail}`)
            setForm({ toEmail: '', toName: '', amountOwed: '', dueDate: '' })
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
                    <p className="eyebrow">Admin</p>
                    <h1>Email Reminders</h1>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="two-column-layout customer-request-layout">
                <div className="panel form-stack">
                    <section>
                        <h2>Send Credit Reminder</h2>
                        <form className="form-grid single-column-form" onSubmit={handleSubmit}>
                            <label>
                                Customer Name
                                <input
                                    type="text"
                                    name="toName"
                                    value={form.toName}
                                    onChange={handleChange}
                                    placeholder="e.g. John Smith"
                                    required
                                />
                            </label>

                            <label>
                                Customer Email
                                <input
                                    type="email"
                                    name="toEmail"
                                    value={form.toEmail}
                                    onChange={handleChange}
                                    placeholder="e.g. john@gmail.com"
                                    required
                                />
                            </label>

                            <label>
                                Amount Owed (£)
                                <input
                                    type="number"
                                    name="amountOwed"
                                    value={form.amountOwed}
                                    onChange={handleChange}
                                    placeholder="e.g. 2500"
                                    min="1"
                                    step="0.01"
                                    required
                                />
                            </label>

                            <label>
                                Due Date
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={form.dueDate}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <div className="form-actions">
                                <button type="submit" className="primary-button" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Reminder'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                <section className="panel">
                    <div className="section-title">
                        <h2>Email Preview</h2>
                    </div>
                    <dl className="details-list request-summary-list" style={{ marginTop: '16px' }}>
                        <div>
                            <dt>To</dt>
                            <dd>{form.toName || '—'} {form.toEmail ? `<${form.toEmail}>` : ''}</dd>
                        </div>
                        <div>
                            <dt>Amount</dt>
                            <dd>{form.amountOwed ? `£${Number(form.amountOwed).toFixed(2)}` : '—'}</dd>
                        </div>
                        <div>
                            <dt>Due Date</dt>
                            <dd>{form.dueDate ? new Date(form.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</dd>
                        </div>
                        <div>
                            <dt>Subject</dt>
                            <dd>DriveCore — Overdue Credit Payment Reminder</dd>
                        </div>
                    </dl>
                </section>
            </div>
        </section>
    )
}

export default EmailReminder