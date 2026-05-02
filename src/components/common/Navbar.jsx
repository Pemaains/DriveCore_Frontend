import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const location = useLocation()

    const links = [
        { path: '/customer/dashboard', label: 'Dashboard' },
        { path: '/book-appointment', label: 'Appointments' },
        { path: '/request-part', label: 'Parts' },
        { path: '/my-reviews', label: 'Reviews' },
    ]

    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>
                <span style={styles.brandName}>DRIVECORE</span>
                <span style={styles.brandDivider}>|</span>
                <span style={styles.brandSub}>Customer Portal</span>
            </div>
            <div style={styles.links}>
                {links.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        style={{
                            ...styles.link,
                            ...(location.pathname === link.path ? styles.activeLink : {})
                        }}
                    >
                        {link.label}
                        {location.pathname === link.path && <span style={styles.activeDot} />}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

const styles = {
    nav: {
        background: '#0a0a0a',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        borderBottom: '1px solid #1f1f1f',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Georgia', serif",
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    brandName: {
        color: '#fff',
        fontSize: '15px',
        fontWeight: '700',
        letterSpacing: '3px',
        fontFamily: "'Georgia', serif",
    },
    brandDivider: {
        color: '#333',
        fontSize: '18px',
    },
    brandSub: {
        color: '#666',
        fontSize: '12px',
        letterSpacing: '1px',
        fontFamily: "'Georgia', serif",
    },
    links: {
        display: 'flex',
        gap: '4px',
    },
    link: {
        color: '#888',
        textDecoration: 'none',
        padding: '8px 20px',
        fontSize: '13px',
        letterSpacing: '0.5px',
        fontFamily: "'Georgia', serif",
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        transition: 'color 0.2s',
    },
    activeLink: {
        color: '#fff',
    },
    activeDot: {
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        bottom: '2px',
    }
}