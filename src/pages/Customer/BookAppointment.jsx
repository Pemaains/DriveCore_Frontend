import Navbar from '../../components/common/Navbar'
import { useState } from 'react'
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
            setError('Failed to book appointment. Make sure the backend is running.')
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
                    <span style={styles.roleTag}>CUSTOMER</span>
                    <h1 style={styles.pageTitle}>Book Appointment</h1>
                </div>

                {/* Main Content */}
                <div style={styles.content}>

                    {/* Left - Form */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Appointment Details</h2>

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
                                <label style={styles.label}>Date and time</label>
                                <input
                                    type="datetime-local"
                                    name="appointmentDate"
                                    value={form.appointmentDate}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Service type</label>
                                <select
                                    name="serviceType"
                                    value={form.serviceType}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                >
                                    <option value="">Select service</option>
                                    <option value="Oil Change">Oil Change</option>
                                    <option value="Brake Inspection">Brake Inspection</option>
                                    <option value="Tire Replacement">Tire Replacement</option>
                                    <option value="Engine Checkup">Engine Checkup</option>
                                    <option value="General Service">General Service</option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Notes</label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="Any special requests..."
                                    style={{ ...styles.input, height: '120px', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" style={styles.button} disabled={loading}>
                                    {loading ? 'Booking...' : 'Book Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right - Status Panel */}
                    <div style={styles.statusCard}>
                        <div style={styles.statusHeader}>
                            <h3 style={styles.statusTitle}>Booking Status</h3>
                            <span style={booking ? styles.badgeSuccess : styles.badge}>
                                {booking ? 'Confirmed' : 'Pending'}
                            </span>
                        </div>

                        {booking ? (
                            <div style={styles.statusDetails}>
                                <p style={styles.statusRow}><strong>ID:</strong> #{booking.id}</p>
                                <p style={styles.statusRow}><strong>Customer:</strong> {booking.customerId}</p>
                                <p style={styles.statusRow}><strong>Service:</strong> {booking.serviceType}</p>
                                <p style={styles.statusRow}><strong>Date:</strong> {new Date(booking.appointmentDate).toLocaleString()}</p>
                                <p style={styles.statusRow}><strong>Status:</strong> {booking.status}</p>
                                {booking.notes && <p style={styles.statusRow}><strong>Notes:</strong> {booking.notes}</p>}
                                <div style={styles.successBanner}>✅ Appointment booked successfully!</div>
                            </div>
                        ) : (
                            <p style={styles.statusEmpty}>No appointment booked yet.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#eef1f5',
        fontFamily: 'Arial, sans-serif',
        padding: '40px 30px'
    },
    wrapper: {
        maxWidth: '1100px',
        margin: '0 auto'
    },
    pageHeader: {
        marginBottom: '24px'
    },
    roleTag: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#2a9d8f',
        letterSpacing: '1.5px',
        textTransform: 'uppercase'
    },
    pageTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#111',
        margin: '4px 0 0'
    },
    content: {
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start'
    },
    card: {
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        flex: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#111',
        marginBottom: '24px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333'
    },
    input: {
        padding: '11px 14px',
        borderRadius: '8px',
        border: '1.5px solid #ddd',
        fontSize: '15px',
        width: '100%',
        boxSizing: 'border-box',
        color: '#111',
        background: '#fff',
        outline: 'none'
    },
    button: {
        padding: '12px 28px',
        background: '#2a9d8f',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    statusCard: {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        flex: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        minWidth: '260px'
    },
    statusHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    statusTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#111',
        margin: 0
    },
    badge: {
        background: '#f0f0f0',
        color: '#555',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600'
    },
    badgeSuccess: {
        background: '#d4edda',
        color: '#155724',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600'
    },
    statusEmpty: {
        color: '#888',
        fontSize: '14px'
    },
    statusDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    statusRow: {
        fontSize: '14px',
        color: '#333',
        margin: 0
    },
    successBanner: {
        marginTop: '12px',
        background: '#d4edda',
        color: '#155724',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    error: {
        background: '#fff3f3',
        border: '1px solid #f5c6cb',
        color: '#721c24',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    }
}