import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const location = useLocation()

    const links = [
        { path: '/customer/dashboard', label: 'Dashboard' },
        { path: '/book-appointment', label: 'Book Appointment' },
        { path: '/request-part', label: 'Request Part' },
    ]

    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>
                <span style={styles.brandName}>DriveCore</span>
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
                    </Link>
                ))}
            </div>
        </nav>
    )
}

const styles = {
    nav: {
        background: '#111',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    brand: { display: 'flex', flexDirection: 'column' },
    brandName: { color: '#fff', fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' },
    brandSub: { color: '#2a9d8f', fontSize: '11px', letterSpacing: '1.5px' },
    links: { display: 'flex', gap: '8px' },
    link: {
        color: '#ccc',
        textDecoration: 'none',
        padding: '8px 18px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s'
    },
    activeLink: {
        background: '#2a9d8f',
        color: '#fff'
    }
}