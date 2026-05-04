import { useCallback, useEffect, useMemo, useState } from 'react'
import DashboardCard from '../../components/DashboardCard'
import { getApiError, staffApi } from '../../services/api'

const roleNames = ['Admin', 'Staff', 'Customer']

function normalizeRole(role) {
  return typeof role === 'number' ? roleNames[role] : role
}

function AdminDashboard() {
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadStaffSummary = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const staff = await staffApi.getAll()
      setStaffList(staff)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadInitialStaffSummary() {
      try {
        const staff = await staffApi.getAll()

        if (!ignore) {
          setStaffList(staff)
          setError('')
        }
      } catch (err) {
        if (!ignore) {
          setError(getApiError(err))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadInitialStaffSummary()

    return () => {
      ignore = true
    }
  }, [])

  const staffSummary = useMemo(() => {
    const activeStaff = staffList.filter((staff) => staff.isActive).length
    const adminUsers = staffList.filter(
      (staff) => normalizeRole(staff.role) === 'Admin',
    ).length

    return {
      activeStaff,
      adminUsers,
      inactiveStaff: staffList.length - activeStaff,
      totalStaff: staffList.length,
    }
  }, [staffList])

  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Dashboard</h1>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={loadStaffSummary}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="dashboard-stats" aria-label="Staff summary">
        <article className="stat-tile">
          <span>Total staff</span>
          <strong>{loading ? '...' : staffSummary.totalStaff}</strong>
        </article>
        <article className="stat-tile">
          <span>Active</span>
          <strong>{loading ? '...' : staffSummary.activeStaff}</strong>
        </article>
        <article className="stat-tile">
          <span>Inactive</span>
          <strong>{loading ? '...' : staffSummary.inactiveStaff}</strong>
        </article>
        <article className="stat-tile">
          <span>Admins</span>
          <strong>{loading ? '...' : staffSummary.adminUsers}</strong>
        </article>
      </section>

      <section className="dashboard-grid" aria-label="Admin functions">
        <DashboardCard
          accent="teal"
          description="Create staff accounts, update staff profiles, change roles, and activate or deactivate users."
          eyebrow="People"
          meta="Available now"
          title="Staff Management"
          to="/admin/staff"
        />
        <DashboardCard
          accent="blue"
          description="Track parts inventory, stock movement, and reorder details when the parts API is added."
          eyebrow="Inventory"
          meta="Module pending"
          title="Manage Parts"
        />
        <DashboardCard
          accent="amber"
          description="Maintain supplier records and purchase contacts when vendor endpoints are ready."
          eyebrow="Supply"
          meta="Module pending"
          title="Manage Vendors"
        />
        <DashboardCard
          accent="rose"
          description="Review purchase invoices and payment records after finance endpoints are connected."
          eyebrow="Finance"
          meta="Module pending"
          title="Purchase Invoices"
        />
        <DashboardCard
          accent="violet"
          description="View revenue, purchase, and operational summaries once reporting data is available."
          eyebrow="Reports"
          meta="Module pending"
          title="Financial Reports"
        />
      </section>
    </section>
  )
}

export default AdminDashboard
