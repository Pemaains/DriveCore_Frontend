import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import Register from './pages/Auth/Register'
import Navbar from './components/Navbar'
import { useAuth } from './hooks/useAuth'
import AdminDashboard from './pages/Admin/Dashboard'
import ManageStaff from './pages/Admin/ManageStaff'
import LoyaltyStatus from './pages/Customer/LoyaltyStatus'
import Login from './pages/Auth/Login'
import StaffDashboard from './pages/Staff/Dashboard'
import RegisterCustomer from './pages/Staff/RegisterCustomer'
import CustomerDetails from './pages/Staff/CustomerDetails'
import SalesInvoices from './pages/Staff/SalesInvoices'
import InvoiceDetails from './pages/Staff/InvoiceDetails'
import CustomerDashboard from './pages/Customer/Dashboard'
import RequestPart from './pages/Customer/RequestPart'
import BookAppointment from './pages/Customer/BookAppointment'
import ReviewService from './pages/Customer/ReviewService'
import LowStockNotifications from './pages/Admin/LowStockNotifications'
import './App.css'

const roleHomePaths = {
  Admin: '/admin/dashboard',
  Staff: '/staff/dashboard',
  Customer: '/customer/dashboard',
}

function getHomePath(role) {
  return roleHomePaths[role] || '/login'
}

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getHomePath(user?.role)} replace />
}

function RequireAuth({ roles, children }) {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={getHomePath(user?.role)} replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth roles={['Admin']}>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <RequireAuth roles={['Admin']}>
                <ManageStaff />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <RequireAuth roles={['Admin']}>
                <LowStockNotifications />
              </RequireAuth>
            }
          />

          <Route
            path="/customer/loyalty"
            element={
              <RequireAuth roles={['Customer']}>
                <LoyaltyStatus />
              </RequireAuth>
            }
          />

          <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
          <Route
            path="/staff/dashboard"
            element={
              <RequireAuth roles={['Staff']}>
                <StaffDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/staff/customers/register"
            element={
              <RequireAuth roles={['Staff']}>
                <RegisterCustomer />
              </RequireAuth>
            }
          />
          <Route
            path="/staff/customers"
            element={
              <RequireAuth roles={['Staff']}>
                <CustomerDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/staff/customers/:id"
            element={
              <RequireAuth roles={['Staff']}>
                <CustomerDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/staff/sales/invoices"
            element={
              <RequireAuth roles={['Staff']}>
                <SalesInvoices />
              </RequireAuth>
            }
          />
          <Route
            path="/staff/sales/invoices/:id"
            element={
              <RequireAuth roles={['Staff']}>
                <InvoiceDetails />
              </RequireAuth>
            }
          />
          <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
          <Route
            path="/customer/dashboard"
            element={
              <RequireAuth roles={['Customer']}>
                <CustomerDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/customer/book-appointment"
            element={
              <RequireAuth roles={['Customer']}>
                <BookAppointment />
              </RequireAuth>
            }
          />
          <Route
            path="/customer/appointments/book"
            element={
              <RequireAuth roles={['Customer']}>
                <BookAppointment />
              </RequireAuth>
            }
          />
          <Route
            path="/book-appointment"
            element={
              <RequireAuth roles={['Customer']}>
                <BookAppointment />
              </RequireAuth>
            }
          />
          <Route
            path="/customer/request-part"
            element={
              <RequireAuth roles={['Customer']}>
                <RequestPart />
              </RequireAuth>
            }
          />
          <Route
            path="/customer/parts/request"
            element={
              <RequireAuth roles={['Customer']}>
                <RequestPart />
              </RequireAuth>
            }
          />
          <Route
            path="/request-part"
            element={
              <RequireAuth roles={['Customer']}>
                <RequestPart />
              </RequireAuth>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <RequireAuth roles={['Customer']}>
                <ReviewService />
              </RequireAuth>
            }
          />
          <Route
            path="/customers"
            element={
              <RequireAuth roles={['Staff']}>
                <CustomerDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <RequireAuth roles={['Staff']}>
                <CustomerDetails />
              </RequireAuth>
            }
          />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
