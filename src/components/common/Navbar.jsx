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
        background: '#1c1c1c',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        borderBottom: '1px solid #303030',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Georgia', serif",
    },
    brand: { display: 'flex', alignItems: 'center', gap: '14px' },
    brandName: { color: '#fff', fontSize: '17px', fontWeight: '700', letterSpacing: '3px' },
    brandDivider: { color: '#444', fontSize: '20px' },
    brandSub: { color: '#999', fontSize: '14px', letterSpacing: '1px' },
    links: { display: 'flex', gap: '4px' },
    link: {
        color: '#aaa',
        textDecoration: 'none',
        padding: '8px 22px',
        fontSize: '15px',
        letterSpacing: '0.5px',
        fontFamily: "'Georgia', serif",
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        transition: 'color 0.2s',
    },
    activeLink: { color: '#fff' },
    activeDot: {
        width: '4px', height: '4px', borderRadius: '50%',
        background: '#fff', position: 'absolute', bottom: '2px',
    }
}