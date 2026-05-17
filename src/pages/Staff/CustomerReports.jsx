import { useEffect, useState } from 'react'
import { getApiError, reportApi } from '../../services/api'

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

function formatDate(value) {
  if (!value) return 'N/A'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function CustomerReports() {
  const [filters, setFilters] = useState({
    topCount: '10',
    overdueAfterDays: '30',
  })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadInitialReport() {
      try {
        const data = await reportApi.getCustomerReports(10, 30)

        if (!ignore) {
          setReport(data)
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

    loadInitialReport()

    return () => {
      ignore = true
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  async function loadReports(event) {
    event?.preventDefault()

    try {
      setLoading(true)
      setError('')
      const data = await reportApi.getCustomerReports(
        Number(filters.topCount),
        Number(filters.overdueAfterDays),
      )
      setReport(data)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Customer Reports</h1>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={loadReports}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <form className="panel form-stack" onSubmit={loadReports}>
        <div className="section-title">
          <h2>Report Filters</h2>
          <span className="count-label">Customer Insights</span>
        </div>

        <div className="form-grid report-filter-grid">
          <label>
            Top Results
            <input
              type="number"
              name="topCount"
              min="1"
              max="100"
              value={filters.topCount}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Overdue After Days
            <input
              type="number"
              name="overdueAfterDays"
              min="1"
              max="3650"
              value={filters.overdueAfterDays}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Loading...' : 'Load Reports'}
          </button>
        </div>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="dashboard-stats" aria-label="Customer report summary">
        <article className="stat-tile">
          <span>Regular Customers</span>
          <strong>{loading ? '...' : report?.regularCustomers?.length ?? 0}</strong>
        </article>
        <article className="stat-tile">
          <span>High Spenders</span>
          <strong>{loading ? '...' : report?.highSpenders?.length ?? 0}</strong>
        </article>
        <article className="stat-tile">
          <span>Pending Credits</span>
          <strong>{loading ? '...' : report?.pendingCredits?.length ?? 0}</strong>
        </article>
        <article className="stat-tile">
          <span>Overdue Threshold</span>
          <strong>{loading ? '...' : report?.overdueAfterDays ?? 0}</strong>
        </article>
      </section>

      <div className="details-layout">
        <section className="panel">
          <div className="section-title">
            <h2>Regular Customers</h2>
            <span className="count-label">{report?.regularCustomers?.length || 0} rows</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Purchases</th>
                  <th>Services</th>
                  <th>Interactions</th>
                  <th>Total Spent</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {report?.regularCustomers?.length ? (
                  report.regularCustomers.map((customer) => (
                    <tr key={customer.customerProfileId}>
                      <td>{customer.fullName}</td>
                      <td>{customer.purchaseCount}</td>
                      <td>{customer.appointmentCount}</td>
                      <td>{customer.totalInteractions}</td>
                      <td>{formatCurrency(customer.totalSpent)}</td>
                      <td>{formatDate(customer.lastActivityAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No regular customer records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="section-title">
            <h2>High Spenders</h2>
            <span className="count-label">{report?.highSpenders?.length || 0} rows</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total Spent</th>
                  <th>Invoices</th>
                  <th>Average Invoice</th>
                  <th>Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {report?.highSpenders?.length ? (
                  report.highSpenders.map((customer) => (
                    <tr key={customer.customerProfileId}>
                      <td>{customer.fullName}</td>
                      <td>{formatCurrency(customer.totalSpent)}</td>
                      <td>{customer.invoiceCount}</td>
                      <td>{formatCurrency(customer.averageInvoiceValue)}</td>
                      <td>{formatDate(customer.lastPurchaseAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No high spender records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="section-title">
            <h2>Pending Credits</h2>
            <span className="count-label">{report?.pendingCredits?.length || 0} rows</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Outstanding</th>
                  <th>Overdue Invoices</th>
                  <th>Oldest Invoice</th>
                  <th>Days Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {report?.pendingCredits?.length ? (
                  report.pendingCredits.map((customer) => (
                    <tr key={customer.customerProfileId}>
                      <td>{customer.fullName}</td>
                      <td>{formatCurrency(customer.outstandingAmount)}</td>
                      <td>{customer.overdueInvoiceCount}</td>
                      <td>{formatDate(customer.oldestInvoiceDate)}</td>
                      <td>{customer.daysOutstanding}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No pending credit records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  )
}

export default CustomerReports
