import { useState } from 'react'
import Navbar from '../../components/common/Navbar'
import api from '../../services/api'

export default function BookAppointment() {
    const [form, setForm] = useState({
        customerId: '',
        appointmentDate: '',
        serviceType: '',
        status: 'Pending',
        notes: ''
    })
    const [booking, setBooking] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await api.post('/Appointment', form)
            setBooking(res.data)
            setForm({ customerId: '', appointmentDate: '', serviceType: '', status: 'Pending', notes: '' })
        } catch {
            setError('Unable to complete booking. Ensure the backend service is running.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.wrapper}>

                <div style={styles.pageHeader}>
                    <p style={styles.pageLabel}>SCHEDULING</p>
                    <h1 style={styles.pageTitle}>Book Appointment</h1>
                </div>

                <div style={styles.divider} />

                <div style={styles.content}>
                    <div style={styles.formSection}>
                        <p style={styles.sectionLabel}>APPOINTMENT DETAILS</p>
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
                                <label style={styles.label}>Date & Time</label>
                                <input type="datetime-local" name="appointmentDate" value={form.appointmentDate}
                                    onChange={handleChange} required style={styles.input}
                                    onFocus={e => e.target.style.borderColor = '#777'}
                                    onBlur={e => e.target.style.borderColor = '#333'} />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Service Type</label>
                                <select name="serviceType" value={form.serviceType} onChange={handleChange}
                                    required style={styles.input}>
                                    <option value="">Select a service</option>
                                    <option value="Oil Change">Oil Change</option>
                                    <option value="Brake Inspection">Brake Inspection</option>
                                    <option value="Tire Replacement">Tire Replacement</option>
                                    <option value="Engine Checkup">Engine Checkup</option>
                                    <option value="General Service">General Service</option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Notes <span style={styles.optional}>(optional)</span></label>
                                <textarea name="notes" value={form.notes} onChange={handleChange}
                                    placeholder="Any specific requests or details..."
                                    style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                                    onFocus={e => e.target.style.borderColor = '#777'}
                                    onBlur={e => e.target.style.borderColor = '#333'} />
                            </div>

                            <button type="submit" style={styles.button} disabled={loading}
                                onMouseEnter={e => e.target.style.background = '#fff'}
                                onMouseLeave={e => e.target.style.background = '#efefef'}>
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>

                    <div style={styles.statusSection}>
                        <p style={styles.sectionLabel}>BOOKING STATUS</p>
                        <div style={styles.statusCard}>
                            <div style={styles.statusTop}>
                                <span style={styles.statusLabel}>Status</span>
                                <span style={booking ? styles.badgeActive : styles.badge}>
                                    {booking ? 'CONFIRMED' : 'AWAITING'}
                                </span>
                            </div>

                            {booking ? (
                                <div style={styles.statusBody}>
                                    <div style={styles.statusDivider} />
                                    {[
                                        ['Reference', `#${String(booking.id).padStart(4, '0')}`],
                                        ['Customer', booking.customerId],
                                        ['Service', booking.serviceType],
                                        ['Date', new Date(booking.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
                                        ['Time', new Date(booking.appointmentDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })],
                                        ...(booking.notes ? [['Notes', booking.notes]] : []),
                                    ].map(([k, v]) => (
                                        <div key={k} style={styles.statusRow}>
                                            <span style={styles.statusKey}>{k}</span>
                                            <span style={styles.statusVal}>{v}</span>
                                        </div>
                                    ))}
                                    <div style={styles.statusDivider} />
                                    <p style={styles.statusConfirm}>Appointment booked successfully.</p>
                                </div>
                            ) : (
                                <p style={styles.statusEmptyText}>Complete the form to book your appointment.</p>
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