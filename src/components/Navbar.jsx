import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">DRIVECORE</span>
        <span className="brand-divider">|</span>
        <span className="brand-sub">
          {isAuthenticated ? `${user.role} Portal` : 'Operations Portal'}
        </span>
      </div>

      <nav className="nav-links" aria-label="Main navigation">
        {!isAuthenticated && <NavLink to="/login">Login</NavLink>}

        {user?.role === 'Admin' && (
          <>
            <NavLink to="/admin/dashboard">Admin</NavLink>
            <NavLink to="/admin/staff">Staff Management</NavLink>
            <NavLink to="/admin/notifications">Notifications</NavLink>
            <NavLink to="/admin/email-reminder">Email Reminder</NavLink>
          </>
        )}

        {user?.role === 'Staff' && (
          <>
            <NavLink to="/staff/dashboard">Service Desk</NavLink>
            <NavLink to="/staff/customers/register">Register</NavLink>
            <NavLink to="/staff/customers">Customers</NavLink>
            <NavLink to="/staff/sales/invoices">Sales</NavLink>
          </>
        )}

        {user?.role === 'Customer' && (
          <>
            <NavLink to="/customer/dashboard">Customer Portal</NavLink>
            <NavLink to="/customer/book-appointment">Appointments</NavLink>
            <NavLink to="/customer/request-part">Parts</NavLink>
            <NavLink to="/my-reviews">Reviews</NavLink>
            <NavLink to="/customer/loyalty">Loyalty</NavLink>
          </>
        )}

        {isAuthenticated && (
          <button type="button" className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  )
}

export default Navbar
