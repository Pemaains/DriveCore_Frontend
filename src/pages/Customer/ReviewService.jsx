import { useState } from 'react'
import Navbar from '../../components/common/Navbar'
import api from '../../services/api'

export default function ReviewService() {
    const [form, setForm] = useState({
        customerId: '',
        rating: 0,
        comment: ''
    })
    const [review, setReview] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [hovered, setHovered] = useState(0)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.rating === 0) { setError('Please select a rating before submitting.'); return }
        setLoading(true)
        try {
            const res = await api.post('/Review', { ...form, rating: parseInt(form.rating) })
            setReview(res.data)
            setForm({ customerId: '', rating: 0, comment: '' })
        } catch (err) {
            setError('Unable to submit review. Ensure the backend service is running.')
        } finally {
            setLoading(false)
        }
    }

    const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.wrapper}>

                <div style={styles.pageHeader}>
                    <p style={styles.pageLabel}>FEEDBACK</p>
                    <h1 style={styles.pageTitle}>Service Review</h1>
                </div>

                <div style={styles.divider} />

                <div style={styles.content}>

                    <div style={styles.formSection}>
                        <p style={styles.sectionLabel}>YOUR EXPERIENCE</p>

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
                                <label style={styles.label}>Rating</label>
                                <div style={styles.ratingWrapper}>
                                    <div style={styles.stars}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setForm({ ...form, rating: star })}
                                                onMouseEnter={() => setHovered(star)}
                                                onMouseLeave={() => setHovered(0)}
                                                style={{
                                                    ...styles.starBtn,
                                                    color: star <= (hovered || form.rating) ? '#e8e8e8' : '#2a2a2a',
                                                }}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <span style={styles.ratingLabel}>
                                        {hovered ? ratingLabels[hovered] : form.rating ? ratingLabels[form.rating] : 'Select a rating'}
                                    </span>
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Comment</label>
                                <textarea
                                    name="comment"
                                    value={form.comment}
                                    onChange={handleChange}
                                    placeholder="Describe your experience with our service in detail..."
                                    required
                                    style={{ ...styles.input, height: '120px', resize: 'vertical' }}
                                    onFocus={e => e.target.style.borderColor = '#555'}
                                    onBlur={e => e.target.style.borderColor = '#222'}
                                />
                            </div>

                            <button type="submit" style={styles.button} disabled={loading}
                                onMouseEnter={e => e.target.style.background = '#fff'}
                                onMouseLeave={e => e.target.style.background = '#f0f0f0'}
                            >
                                {loading ? 'Processing...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>

                    <div style={styles.statusSection}>
                        <p style={styles.sectionLabel}>REVIEW STATUS</p>

                        <div style={styles.statusCard}>
                            <div style={styles.statusTop}>
                                <span style={styles.statusLabel}>Status</span>
                                <span style={review ? styles.statusBadgeActive : styles.statusBadge}>
                                    {review ? 'SUBMITTED' : 'AWAITING'}
                                </span>
                            </div>

                            {review ? (
                                <div style={styles.statusBody}>
                                    <div style={styles.statusDivider} />
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Reference</span>
                                        <span style={styles.statusVal}>#{String(review.id).padStart(4, '0')}</span>
                                    </div>
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Customer</span>
                                        <span style={styles.statusVal}>{review.customerId}</span>
                                    </div>
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Rating</span>
                                        <span style={styles.statusVal}>
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <span key={s} style={{ color: s <= review.rating ? '#ccc' : '#2a2a2a', fontSize: '14px' }}>★</span>
                                            ))} {ratingLabels[review.rating]}
                                        </span>
                                    </div>
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Comment</span>
                                        <span style={styles.statusVal}>{review.comment}</span>
                                    </div>
                                    <div style={styles.statusRow}>
                                        <span style={styles.statusKey}>Date</span>
                                        <span style={styles.statusVal}>{new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div style={styles.statusDivider} />
                                    <p style={styles.statusConfirm}>Thank you. Your feedback has been recorded.</p>
                                </div>
                            ) : (
                                <div style={styles.statusEmpty}>
                                    <p style={styles.statusEmptyText}>Share your experience to help us improve our services.</p>
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
    ratingWrapper: { display: 'flex', alignItems: 'center', gap: '16px' },
    stars: { display: 'flex', gap: '4px' },
    starBtn: {
        background: 'none',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        padding: '4px',
        transition: 'color 0.1s',
        lineHeight: 1,
    },
    ratingLabel: { fontSize: '12px', color: '#555', letterSpacing: '0.5px' },
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