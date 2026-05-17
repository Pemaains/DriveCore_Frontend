import { useState } from 'react'
import { getApiError } from '../../services/api'
import apiClient from '../../services/api'

function LoyaltyStatus() {
    const [form, setForm] = useState({ customerId: '', purchaseAmount: '' })
    const [loyalty, setLoyalty] = useState(null)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleCheckStatus(e) {
        e.preventDefault()
        if (!form.customerId.trim()) { setError('Customer ID is required.'); return }
        try {
            setLoading(true)
            setError('')
            const res = await apiClient.get(`/api/loyalty/${form.customerId.trim()}`)
            setLoyalty(res.data)
        } catch (err) {
            setError(getApiError(err))
        } finally {
            setLoading(false)
        }
    }

    async function handlePurchase(e) {
        e.preventDefault()
        if (!form.customerId.trim()) { setError('Customer ID is required.'); return }
        if (!form.purchaseAmount || Number(form.purchaseAmount) <= 0) { setError('Valid purchase amount is required.'); return }
        try {
            setSaving(true)
            setError('')
            const res = await apiClient.post('/api/loyalty/purchase', {
                customerId: form.customerId.trim(),
                purchaseAmount: Number(form.purchaseAmount)
            })
            setResult(res.data)
            setLoyalty(null)
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
                    <p className="eyebrow">Customer</p>
                    <h1>Loyalty Program</h1>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="two-column-layout customer-request-layout">
                <div className="panel form-stack">

                    {/* Check Status */}
                    <section>
                        <h2>Check Loyalty Status</h2>
                        <form className="form-grid single-column-form" onSubmit={handleCheckStatus}>
                            <label>
                                Customer ID
                                <input
                                    type="text"
                                    name="customerId"
                                    value={form.customerId}
                                    onChange={handleChange}
                                    placeholder="Enter your customer ID"
                                    required
                                />
                            </label>
                            <div className="form-actions">
                                <button type="submit" className="secondary-button" disabled={loading}>
                                    {loading ? 'Checking...' : 'Check Status'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Record Purchase */}
                    <section>
                        <h2>Record a Purchase</h2>
                        <form className="form-grid single-column-form" onSubmit={handlePurchase}>
                            <label>
                                Purchase Amount (£)
                                <input
                                    type="number"
                                    name="purchaseAmount"
                                    value={form.purchaseAmount}
                                    onChange={handleChange}
                                    placeholder="e.g. 6000"
                                    min="1"
                                    step="0.01"
                                    required
                                />
                            </label>
                            <div className="form-actions">
                                <button type="submit" className="primary-button" disabled={saving}>
                                    {saving ? 'Processing...' : 'Apply Purchase'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                {/* Right Panel */}
                <section className="panel">
                    <div className="section-title">
                        <h2>Status</h2>
                        <span className="count-label">
                            {result?.isEligible || loyalty?.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                        </span>
                    </div>

                    {result ? (
                        <dl className="details-list request-summary-list" style={{ marginTop: '16px' }}>
                            <div>
                                <dt>Customer ID</dt>
                                <dd>{result.customerId}</dd>
                            </div>
                            <div>
                                <dt>Purchase Amount</dt>
                                <dd>£{result.purchaseAmount?.toFixed(2)}</dd>
                            </div>
                            <div>
                                <dt>Discount Applied</dt>
                                <dd style={{ color: result.discountApplied > 0 ? '#2a6a3a' : '#999' }}>
                                    £{result.discountApplied?.toFixed(2)}
                                </dd>
                            </div>
                            <div>
                                <dt>Final Amount</dt>
                                <dd><strong>£{result.finalAmount?.toFixed(2)}</strong></dd>
                            </div>
                            <div>
                                <dt>Total Spent</dt>
                                <dd>£{result.totalSpent?.toFixed(2)}</dd>
                            </div>
                            <div style={{ gridColumn: '1/-1' }}>
                                <dt>Message</dt>
                                <dd style={{ color: result.isEligible ? '#2a6a3a' : '#555' }}>
                                    {result.message}
                                </dd>
                            </div>
                        </dl>
                    ) : loyalty ? (
                        <dl className="details-list request-summary-list" style={{ marginTop: '16px' }}>
                            <div>
                                <dt>Customer ID</dt>
                                <dd>{loyalty.customerId}</dd>
                            </div>
                            <div>
                                <dt>Total Spent</dt>
                                <dd>£{loyalty.totalSpent?.toFixed(2)}</dd>
                            </div>
                            <div>
                                <dt>Discount</dt>
                                <dd>{loyalty.discountPercentage}%</dd>
                            </div>
                            <div>
                                <dt>Eligible</dt>
                                <dd style={{ color: loyalty.isEligible ? '#2a6a3a' : '#8a3a3a' }}>
                                    {loyalty.isEligible ? 'Yes — 10% discount active' : 'No — spend £5000+ in one purchase'}
                                </dd>
                            </div>
                        </dl>
                    ) : (
                        <p className="muted" style={{ marginTop: '16px' }}>
                            Enter your customer ID and check your loyalty status or record a purchase.
                        </p>
                    )}
                </section>
            </div>
        </section>
    )
}

export default LoyaltyStatus
