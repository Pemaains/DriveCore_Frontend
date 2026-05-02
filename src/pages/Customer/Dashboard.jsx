import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'

export default function CustomerDashboard() {
    const navigate = useNavigate()

    const features = [
        {
            title: 'Book Appointment',
            description: 'Schedule a service appointment for your vehicle at your preferred date and time.',
            label: 'SCHEDULING',
            path: '/book-appointment',
        },
        {
            title: 'Request a Part',
            description: "Submit a request for an unavailable part and we'll source it for you.",
            label: 'PROCUREMENT',
            path: '/request-part',
        },
        {
            title: 'Service Reviews',
            description: 'Rate and review the services you have received. Your feedback matters.',
            label: 'FEEDBACK',
            path: '/my-reviews',
        }
    ]

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.wrapper}>

                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <p style={styles.headerLabel}>CUSTOMER PORTAL</p>
                        <h1 style={styles.headerTitle}>Welcome back.</h1>
                        <p style={styles.headerSub}>
                            Manage your vehicle services, parts, and feedback from one place.
                        </p>
                    </div>
                    <div style={styles.headerRight}>
                        <div style={styles.statBox}>
                            <span style={styles.statNumber}>3</span>
                            <span style={styles.statLabel}>Services Available</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={styles.divider} />

                {/* Section Title */}
                <p style={styles.sectionLabel}>AVAILABLE SERVICES</p>

                {/* Cards */}
                <div style={styles.grid}>
                    {features.map((feature, i) => (
                        <div
                            key={feature.path}
                            style={styles.card}
                            onClick={() => navigate(feature.path)}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#111'
                                e.currentTarget.style.borderColor = '#444'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = '#0d0d0d'
                                e.currentTarget.style.borderColor = '#222'
                            }}
                        >
                            <div style={styles.cardTop}>
                                <span style={styles.cardLabel}>{feature.label}</span>
                                <span style={styles.cardNumber}>0{i + 1}</span>
                            </div>
                            <h3 style={styles.cardTitle}>{feature.title}</h3>
                            <p style={styles.cardDesc}>{feature.description}</p>
                            <div style={styles.cardFooter}>
                                <span style={styles.cardAction}>Access →</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#060606',
        fontFamily: "'Georgia', serif",
        color: '#fff',
    },
    wrapper: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '64px 48px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '48px',
    },
    headerLeft: {
        flex: 1,
    },
    headerLabel: {
        fontSize: '11px',
        letterSpacing: '3px',
        color: '#555',
        margin: '0 0 16px',
        fontFamily: "'Georgia', serif",
    },
    headerTitle: {
        fontSize: '52px',
        fontWeight: '400',
        color: '#fff',
        margin: '0 0 12px',
        lineHeight: 1.1,
        fontFamily: "'Georgia', serif",
    },
    headerSub: {
        fontSize: '15px',
        color: '#666',
        margin: 0,
        maxWidth: '440px',
        lineHeight: 1.6,
    },
    headerRight: {
        textAlign: 'right',
    },
    statBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '4px',
    },
    statNumber: {
        fontSize: '48px',
        color: '#333',
        fontWeight: '300',
        lineHeight: 1,
    },
    statLabel: {
        fontSize: '11px',
        color: '#444',
        letterSpacing: '2px',
    },
    divider: {
        height: '1px',
        background: '#1a1a1a',
        marginBottom: '32px',
    },
    sectionLabel: {
        fontSize: '11px',
        letterSpacing: '3px',
        color: '#444',
        margin: '0 0 24px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px',
    },
    card: {
        background: '#0d0d0d',
        border: '1px solid #222',
        padding: '36px 32px',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: '260px',
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: '10px',
        letterSpacing: '2px',
        color: '#444',
    },
    cardNumber: {
        fontSize: '12px',
        color: '#333',
        letterSpacing: '1px',
    },
    cardTitle: {
        fontSize: '22px',
        fontWeight: '400',
        color: '#fff',
        margin: 0,
        lineHeight: 1.2,
        fontFamily: "'Georgia', serif",
    },
    cardDesc: {
        fontSize: '13px',
        color: '#555',
        margin: 0,
        lineHeight: 1.7,
        flex: 1,
    },
    cardFooter: {
        borderTop: '1px solid #1a1a1a',
        paddingTop: '16px',
        marginTop: 'auto',
    },
    cardAction: {
        fontSize: '12px',
        color: '#666',
        letterSpacing: '0.5px',
    },
}