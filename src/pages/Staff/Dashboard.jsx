import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardCard from '../../components/DashboardCard'

function StaffDashboard() {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState('')
  const [error, setError] = useState('')

  function handleCustomerLookup(event) {
    event.preventDefault()

    if (!customerId.trim()) {
      setError('Customer ID is required.')
      return
    }

    setError('')
    navigate(`/staff/customers/${customerId.trim()}`)
  }

  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <section className="dashboard-split">
        <div className="panel dashboard-lookup">
          <div className="section-title">
            <h2>Customer Lookup</h2>
          </div>

          <form className="lookup-bar compact-lookup" onSubmit={handleCustomerLookup}>
            <label>
              Customer ID
              <input
                type="number"
                min="1"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="primary-button">
              Load Customer
            </button>
          </form>

          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <div className="panel dashboard-notes">
          <div className="section-title">
            <h2>Active Work</h2>
          </div>
          <p className="muted">
            Staff can register customers with vehicle details, then search saved
            customer records for service desk follow-up.
          </p>
        </div>
      </section>

      <section className="dashboard-grid" aria-label="Staff functions">
        <DashboardCard
          accent="teal"
          description="Create a customer account and add the first vehicle in one workflow."
          eyebrow="Customers"
          meta="Available now"
          title="Register Customer"
          to="/staff/customers/register"
        />
        <DashboardCard
          accent="blue"
          description="Search customer profiles by ID, name, phone, or vehicle number."
          eyebrow="Records"
          meta="Available now"
          title="Customer Details"
          to="/staff/customers"
        />
        <DashboardCard
          accent="amber"
          description="Browse and maintain the full customer list after list endpoints are added."
          eyebrow="Customers"
          meta="Module pending"
          title="Manage Customers"
        />
        <DashboardCard
          accent="rose"
          description="Sell parts, create staff invoices, and send invoice emails from the service desk."
          eyebrow="Billing"
          meta="Available now"
          title="Sales Invoices"
          to="/staff/sales/invoices"
        />
        <DashboardCard
          accent="violet"
          description="Review regular customers, high spenders, and pending credit follow-up in one place."
          eyebrow="Reports"
          meta="Available now"
          title="Customer Reports"
          to="/staff/reports/customers"
        />
      </section>
    </section>
  )
}

export default StaffDashboard
