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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await api.post('/Appointment', form)
            setBooking(res.data)
            setForm({ customerId: '', appointmentDate: '', serviceType: '', status: 'Pending', notes: '' })
        } catch (err) {
            setError('Unable to complete booking. Ensure the backend service is running.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.wrapper}>

                {/* Page Header */}
                <div style={styles.pageHeader}>
                    <p style={styles.pageLabel}>SCHEDULING</p>
                    <h1 style={styles.pageTitle}>Book Appointment</h1>
                </div>

                <div style={styles.divider} />

                <div style={styles.content}>

                    {/* Left - Form */}
                    <div style={styles.formSection}>
                        <p style={styles.sectionLabel}>APPOINTMENT DETAILS</p>

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
                                    onFocus={e => e.target.style.borderColor = '#555'}
                                    onBlur={e => e.target.style.borderColor = '#222'}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="appointmentDate"
                                    value={form.appointmentDate}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                    onFocus={e => e.target.style.borderColor = '#555'}
                                    onBlur={e => e.target.style.borderColor = '#222'}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Service Type</label>
                                <select
                                    name="serviceType"
                                    value={form.serviceType}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                >
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
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="Any specific requests or details..."
                                    style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                                    onFocus={e => e.target.style.borderColor = '#555'}
                                    onBlur={e => e.target.style.borderColor = '#222'}
                                />
                            </div>

                            <button type="submit" style={styles.button} disabled={loading}
                                onMouseEnter={e => e.target.style.background = '#fff'}
                                onMouseLeave={e => e.target.style.background = '#f0f0f0'}
                            >
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>

                    {/* Right - Status */}
                    <div style={styles.statusSection}>
                        <p style={styles.sectionLabel}>BOOKING STATUS</p>

                        <div style={styles.statusCard}>
                            <div style={styles.statusTop}>
                                <span style={styles.statusLabel}>Status</span>
                                <span style={booking ? styles.statusBadgeActive : styles.statusBadge}>
                                    {booking ? 'CONFIRMED' : 'AWAITING'}
                                </span>
                            </div>

                            {booking ? (
                                <div style={styles.statusBody}>
                                    <div style={styles.statusDivider} />
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Reference</span>
                                        <span style={styles.statusVal}>#{String(booking.id).padStart(4, '0')}</span>
                                    </div>
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Customer</span>
                                        <span style={styles.statusVal}>{booking.customerId}</span>
                                    </div>
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Service</span>
                                        <span style={styles.statusVal}>{booking.serviceType}</span>
                                    </div>
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Date</span>
                                        <span style={styles.statusVal}>{new Date(booking.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Time</span>
                                        <span style={styles.statusVal}>{new Date(booking.appointmentDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {booking.notes && (
                                        <div style={styles.statusRow}>
                                            <span style={styles.statusKey}>Notes</span>
                                            <span style={styles.statusVal}>{booking.notes}</span>
                                        </div>
                                    )}
                                    <div style={styles.statusDivider} />
                                    <p style={styles.statusConfirm}>Appointment booked successfully.</p>
                                </div>
                            ) : (
                                <div style={styles.statusEmpty}>
                                    <p style={styles.statusEmptyText}>Complete the form to book your appointment.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', background: '#060606', fontFamily: "'Georgia', serif", color: '#fff' },
    wrapper: { maxWidth: '1100px', margin: '0 auto', padding: '64px 48px' },
    pageHeader: { marginBottom: '32px' },
    pageLabel: { fontSize: '11px', letterSpacing: '3px', color: '#444', margin: '0 0 12px' },
    pageTitle: { fontSize: '42px', fontWeight: '400', color: '#fff', margin: 0, fontFamily: "'Georgia', serif" },
    divider: { height: '1px', background: '#1a1a1a', marginBottom: '48px' },
    content: { display: 'flex', gap: '64px', alignItems: 'flex-start' },
    formSection: { flex: 1.4 },
    sectionLabel: { fontSize: '10px', letterSpacing: '3px', color: '#444', margin: '0 0 24px' },
    form: { display: 'flex', flexDirection: 'column', gap: '24px' },
    field: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '12px', color: '#888', letterSpacing: '0.5px' },
    optional: { color: '#444', fontSize: '11px' },
    input: {
        padding: '14px 16px',
        background: '#0d0d0d',
        border: '1px solid #222',
        borderRadius: '2px',
        fontSize: '14px',
        color: '#fff',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Georgia', serif",
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '16px',
        background: '#f0f0f0',
        color: '#000',
        border: 'none',
        borderRadius: '2px',
        fontSize: '13px',
        fontWeight: '600',
        letterSpacing: '1px',
        cursor: 'pointer',
        marginTop: '8px',
        fontFamily: "'Georgia', serif",
        transition: 'background 0.2s',
    },
    error: { background: '#111', border: '1px solid #333', color: '#999', padding: '14px 16px', borderRadius: '2px', fontSize: '13px', marginBottom: '8px' },
    statusSection: { flex: 1 },
    statusCard: { background: '#0d0d0d', border: '1px solid #1f1f1f', padding: '28px', borderRadius: '2px' },
    statusTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    statusLabel: { fontSize: '12px', color: '#555' },
    statusBadge: { fontSize: '10px', letterSpacing: '2px', color: '#444', background: '#111', padding: '6px 12px', border: '1px solid #222' },
    statusBadgeActive: { fontSize: '10px', letterSpacing: '2px', color: '#d4edda', background: '#0d1f12', padding: '6px 12px', border: '1px solid #1a3a22' },
    statusBody: { display: 'flex', flexDirection: 'column', gap: '12px' },
    statusDivider: { height: '1px', background: '#1a1a1a', margin: '4px 0' },
    statusRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
    statusKey: { fontSize: '11px', color: '#444', letterSpacing: '0.5px', minWidth: '70px' },
    statusVal: { fontSize: '13px', color: '#ccc', textAlign: 'right' },
    statusConfirm: { fontSize: '12px', color: '#4a8', margin: 0, textAlign: 'center', letterSpacing: '0.5px' },
    statusEmpty: { paddingTop: '24px' },
    statusEmptyText: { fontSize: '13px', color: '#333', lineHeight: 1.6, margin: 0 },
}