import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'

export default function CustomerDashboard() {
    const navigate = useNavigate()

    const features = [
        {
            title: 'Book Appointment',
            description: 'Schedule a service appointment for your vehicle at your preferred date and time.',
            icon: '📅',
            path: '/book-appointment',
            color: '#2a9d8f'
        },
        {
            title: 'Request a Part',
            description: 'Can\'t find the part you need? Submit a request and we\'ll source it for you.',
            icon: '🔧',
            path: '/request-part',
            color: '#e76f51'
        },
        {
            title: 'My Reviews',
            description: 'Share your experience and rate the services you have received from us.',
            icon: '⭐',
            path: '/my-reviews',
            color: '#f4a261'
        }
    ]

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.wrapper}>
                {/* Welcome Banner */}
                <div style={styles.banner}>
                    <div>
                        <span style={styles.roleTag}>CUSTOMER</span>
                        <h1 style={styles.bannerTitle}>Welcome to DriveCore</h1>
                        <p style={styles.bannerSub}>Manage your appointments, part requests, and service reviews all in one place.</p>
                    </div>
                    <div style={styles.bannerIcon}>🚗</div>
                </div>

                {/* Feature Cards */}
                <h2 style={styles.sectionTitle}>What would you like to do?</h2>
                <div style={styles.grid}>
                    {features.map((feature) => (
                        <div
                            key={feature.path}
                            style={styles.card}
                            onClick={() => navigate(feature.path)}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ ...styles.iconBox, background: feature.color }}>
                                <span style={styles.icon}>{feature.icon}</span>
                            </div>
                            <h3 style={styles.cardTitle}>{feature.title}</h3>
                            <p style={styles.cardDesc}>{feature.description}</p>
                            <button style={{ ...styles.cardBtn, background: feature.color }}>
                                Go to {feature.title} →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', background: '#eef1f5', fontFamily: 'Arial, sans-serif' },
    wrapper: { maxWidth: '1100px', margin: '0 auto', padding: '40px 30px' },
    banner: {
        background: '#111',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    roleTag: { fontSize: '12px', fontWeight: 'bold', color: '#2a9d8f', letterSpacing: '1.5px' },
    bannerTitle: { fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: '8px 0' },
    bannerSub: { color: '#aaa', fontSize: '15px', maxWidth: '500px' },
    bannerIcon: { fontSize: '80px' },
    sectionTitle: { fontSize: '20px', fontWeight: 'bold', color: '#111', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
    card: {
        background: '#fff',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    iconBox: {
        width: '52px',
        height: '52px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: { fontSize: '26px' },
    cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111', margin: 0 },
    cardDesc: { fontSize: '14px', color: '#666', lineHeight: '1.5', margin: 0, flex: 1 },
    cardBtn: {
        padding: '10px 16px',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textAlign: 'left',
        marginTop: '8px'
    }
}