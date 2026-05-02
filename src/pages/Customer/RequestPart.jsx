import Navbar from '../../components/common/Navbar'
import { useState } from 'react'
import api from '../../services/api'

export default function RequestPart() {
    const [form, setForm] = useState({
        customerId: '',
        partName: '',
        description: '',
        status: 'Pending'
    })
    const [request, setRequest] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await api.post('/PartRequest', form)
            setRequest(res.data)
            setForm({ customerId: '', partName: '', description: '', status: 'Pending' })
        } catch (err) {
            setError('Failed to submit request. Make sure the backend is running.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.wrapper}>

                <div style={styles.pageHeader}>
                    <span style={styles.roleTag}>CUSTOMER</span>
                    <h1 style={styles.pageTitle}>Request a Part</h1>
                </div>

                <div style={styles.content}>

                    {/* Left - Form */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Part Request Details</h2>

                        {error && <div style={styles.error}>{error}</div>}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.field}>
                                <label style={styles.label}>Customer ID</label>
                                <input
                                    name="customerId"
                                    value={form.customerId}
                                    onChange={handleChange}
                                    placeholder="Enter your customer ID"
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Part Name</label>
                                <input
                                    name="partName"
                                    value={form.partName}
                                    onChange={handleChange}
                                    placeholder="e.g. BMW E46 Headlight Assembly"
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe the part you need in detail..."
                                    style={{ ...styles.input, height: '120px', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" style={styles.button} disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right - Status Panel */}
                    <div style={styles.statusCard}>
                        <div style={styles.statusHeader}>
                            <h3 style={styles.statusTitle}>Request Status</h3>
                            <span style={request ? styles.badgeSuccess : styles.badge}>
                                {request ? request.status : 'Pending'}
                            </span>
                        </div>

                        {request ? (
                            <div style={styles.statusDetails}>
                                <p style={styles.statusRow}><strong>ID:</strong> #{request.id}</p>
                                <p style={styles.statusRow}><strong>Customer:</strong> {request.customerId}</p>
                                <p style={styles.statusRow}><strong>Part:</strong> {request.partName}</p>
                                {request.description && <p style={styles.statusRow}><strong>Description:</strong> {request.description}</p>}
                                <p style={styles.statusRow}><strong>Status:</strong> {request.status}</p>
                                <p style={styles.statusRow}><strong>Requested:</strong> {new Date(request.requestedAt).toLocaleString()}</p>
                                <div style={styles.successBanner}>✅ Part request submitted successfully!</div>
                            </div>
                        ) : (
                            <p style={styles.statusEmpty}>No request submitted yet.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', background: '#eef1f5', fontFamily: 'Arial, sans-serif', padding: '40px 30px' },
    wrapper: { maxWidth: '1100px', margin: '0 auto' },
    pageHeader: { marginBottom: '24px' },
    roleTag: { fontSize: '12px', fontWeight: 'bold', color: '#2a9d8f', letterSpacing: '1.5px' },
    pageTitle: { fontSize: '32px', fontWeight: 'bold', color: '#111', margin: '4px 0 0' },
    content: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
    card: { background: '#fff', borderRadius: '12px', padding: '32px', flex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
    cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111', marginBottom: '24px' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#333' },
    input: { padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '15px', width: '100%', boxSizing: 'border-box', color: '#111', background: '#fff' },
    button: { padding: '12px 28px', background: '#2a9d8f', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' },
    statusCard: { background: '#fff', borderRadius: '12px', padding: '24px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', minWidth: '260px' },
    statusHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    statusTitle: { fontSize: '16px', fontWeight: 'bold', color: '#111', margin: 0 },
    badge: { background: '#f0f0f0', color: '#555', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
    badgeSuccess: { background: '#d4edda', color: '#155724', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
    statusEmpty: { color: '#888', fontSize: '14px' },
    statusDetails: { display: 'flex', flexDirection: 'column', gap: '8px' },
    statusRow: { fontSize: '14px', color: '#333', margin: 0 },
    successBanner: { marginTop: '12px', background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' },
    error: { background: '#fff3f3', border: '1px solid #f5c6cb', color: '#721c24', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }
}