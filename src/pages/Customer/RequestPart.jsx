import { useState } from 'react'
import Navbar from '../../components/common/Navbar'
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

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await api.post('/PartRequest', form)
            setRequest(res.data)
            setForm({ customerId: '', partName: '', description: '', status: 'Pending' })
        } catch {
            setError('Unable to submit request. Ensure the backend service is running.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.wrapper}>

                <div style={styles.pageHeader}>
                    <p style={styles.pageLabel}>PROCUREMENT</p>
                    <h1 style={styles.pageTitle}>Request a Part</h1>
                </div>

                <div style={styles.divider} />

                <div style={styles.content}>
                    <div style={styles.formSection}>
                        <p style={styles.sectionLabel}>PART REQUEST DETAILS</p>
                        {error && <div style={styles.error}>{error}</div>}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.field}>
                                <label style={styles.label}>Customer ID</label>
                                <input name="customerId" value={form.customerId} onChange={handleChange}
                                    placeholder="Enter your customer ID" required style={styles.input}
                                    onFocus={e => e.target.style.borderColor = '#777'}
                                    onBlur={e => e.target.style.borderColor = '#333'} />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Part Name</label>
                                <input name="partName" value={form.partName} onChange={handleChange}
                                    placeholder="e.g. BMW E46 Headlight Assembly" required style={styles.input}
                                    onFocus={e => e.target.style.borderColor = '#777'}
                                    onBlur={e => e.target.style.borderColor = '#333'} />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Description <span style={styles.optional}>(optional)</span></label>
                                <textarea name="description" value={form.description} onChange={handleChange}
                                    placeholder="Describe the part, vehicle model, year, and any relevant details..."
                                    style={{ ...styles.input, height: '120px', resize: 'vertical' }}
                                    onFocus={e => e.target.style.borderColor = '#777'}
                                    onBlur={e => e.target.style.borderColor = '#333'} />
                            </div>

                            <button type="submit" style={styles.button} disabled={loading}
                                onMouseEnter={e => e.target.style.background = '#fff'}
                                onMouseLeave={e => e.target.style.background = '#efefef'}>
                                {loading ? 'Processing...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>

                    <div style={styles.statusSection}>
                        <p style={styles.sectionLabel}>REQUEST STATUS</p>
                        <div style={styles.statusCard}>
                            <div style={styles.statusTop}>
                                <span style={styles.statusLabel}>Status</span>
                                <span style={request ? styles.badgeActive : styles.badge}>
                                    {request ? 'RECEIVED' : 'AWAITING'}
                                </span>
                            </div>

                            {request ? (
                                <div style={styles.statusBody}>
                                    <div style={styles.statusDivider} />
                                    {[
                                        ['Reference', `#${String(request.id).padStart(4, '0')}`],
                                        ['Customer', request.customerId],
                                        ['Part', request.partName],
                                        ...(request.description ? [['Details', request.description]] : []),
                                        ['Submitted', new Date(request.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
                                    ].map(([k, v]) => (
                                        <div key={k} style={styles.statusRow}>
                                            <span style={styles.statusKey}>{k}</span>
                                            <span style={styles.statusVal}>{v}</span>
                                        </div>
                                    ))}
                                    <div style={styles.statusDivider} />
                                    <p style={styles.statusConfirm}>Request received. We will source this part for you.</p>
                                </div>
                            ) : (
                                <p style={styles.statusEmptyText}>Submit a request and we will locate the part for your vehicle.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', background: '#181818', fontFamily: "'Georgia', serif", color: '#fff' },
    wrapper: { maxWidth: '1100px', margin: '0 auto', padding: '64px 48px' },
    pageHeader: { marginBottom: '32px' },
    pageLabel: { fontSize: '12px', letterSpacing: '3px', color: '#555', margin: '0 0 12px' },
    pageTitle: { fontSize: '44px', fontWeight: '400', color: '#f0f0f0', margin: 0 },
    divider: { height: '1px', background: '#2e2e2e', marginBottom: '48px' },
    content: { display: 'flex', gap: '64px', alignItems: 'flex-start' },
    formSection: { flex: 1.4 },
    sectionLabel: { fontSize: '12px', letterSpacing: '3px', color: '#555', margin: '0 0 28px' },
    form: { display: 'flex', flexDirection: 'column', gap: '24px' },
    field: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '14px', color: '#aaa', letterSpacing: '0.5px' },
    optional: { color: '#555', fontSize: '13px' },
    input: {
        padding: '14px 16px', background: '#222', border: '1px solid #333',
        borderRadius: '3px', fontSize: '15px', color: '#eee', width: '100%',
        boxSizing: 'border-box', fontFamily: "'Georgia', serif", outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '16px', background: '#efefef', color: '#111', border: 'none',
        borderRadius: '3px', fontSize: '15px', fontWeight: '600', letterSpacing: '1px',
        cursor: 'pointer', marginTop: '8px', fontFamily: "'Georgia', serif", transition: 'background 0.2s',
    },
    error: { background: '#222', border: '1px solid #444', color: '#aaa', padding: '14px 16px', borderRadius: '3px', fontSize: '14px', marginBottom: '8px' },
    statusSection: { flex: 1 },
    statusCard: { background: '#222', border: '1px solid #333', padding: '28px', borderRadius: '3px' },
    statusTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    statusLabel: { fontSize: '14px', color: '#777' },
    badge: { fontSize: '11px', letterSpacing: '2px', color: '#555', background: '#2a2a2a', padding: '6px 14px', border: '1px solid #333', borderRadius: '2px' },
    badgeActive: { fontSize: '11px', letterSpacing: '2px', color: '#b8dfc0', background: '#1a2e1e', padding: '6px 14px', border: '1px solid #2a4a30', borderRadius: '2px' },
    statusBody: { display: 'flex', flexDirection: 'column', gap: '12px' },
    statusDivider: { height: '1px', background: '#2e2e2e', margin: '4px 0' },
    statusRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
    statusKey: { fontSize: '13px', color: '#555', minWidth: '75px' },
    statusVal: { fontSize: '14px', color: '#ccc', textAlign: 'right' },
    statusConfirm: { fontSize: '13px', color: '#5a9', margin: 0, textAlign: 'center', letterSpacing: '0.5px' },
    statusEmptyText: { fontSize: '14px', color: '#555', lineHeight: 1.7, margin: '24px 0 0' },
}