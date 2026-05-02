import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerDashboard from './pages/Customer/Dashboard'
import BookAppointment from './pages/Customer/BookAppointment'
import RequestPart from './pages/Customer/RequestPart'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customer/dashboard" />} />
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/request-part" element={<RequestPart />} />
    </Routes>
  )
}

export default App