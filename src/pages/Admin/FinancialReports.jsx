import { useEffect, useMemo, useState } from 'react'
import { getApiError, reportApi } from '../../services/api'

function getCurrentDateParts() {
  const now = new Date()
  return {
    date: now.toISOString().slice(0, 10),
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
  }
}

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

function getLabel(reportType) {
  if (reportType === 'daily') return 'Daily'
  if (reportType === 'yearly') return 'Yearly'
  return 'Monthly'
}

function FinancialReports() {
  const initialFilters = useMemo(() => getCurrentDateParts(), [])
  const [filters, setFilters] = useState({
    reportType: 'monthly',
    date: initialFilters.date,
    month: initialFilters.month,
    year: initialFilters.year,
  })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadInitialReport() {
      try {
        const data = await reportApi.getMonthlyFinancial(
          Number(initialFilters.year),
          Number(initialFilters.month),
        )

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
  }, [initialFilters.month, initialFilters.year])

  function handleChange(event) {
    const { name, value } = event.target
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  async function loadReport(event) {
    event?.preventDefault()

    try {
      setLoading(true)
      setError('')

      let data
      if (filters.reportType === 'daily') {
        data = await reportApi.getDailyFinancial(filters.date)
      } else if (filters.reportType === 'yearly') {
        data = await reportApi.getYearlyFinancial(Number(filters.year))
      } else {
        data = await reportApi.getMonthlyFinancial(
          Number(filters.year),
          Number(filters.month),
        )
      }

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
          <p className="eyebrow">Admin</p>
          <h1>Financial Reports</h1>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={loadReport}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <form className="panel form-stack" onSubmit={loadReport}>
        <div className="section-title">
          <h2>Report Filters</h2>
          <span className="count-label">{getLabel(filters.reportType)}</span>
        </div>

        <div className="form-grid report-filter-grid">
          <label>
            Report Type
            <select
              name="reportType"
              value={filters.reportType}
              onChange={handleChange}
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>

          {filters.reportType === 'daily' && (
            <label>
              Date
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                required
              />
            </label>
          )}

          {filters.reportType === 'monthly' && (
            <>
              <label>
                Month
                <select
                  name="month"
                  value={filters.month}
                  onChange={handleChange}
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index + 1} value={String(index + 1)}>
                      {new Date(2026, index, 1).toLocaleString(undefined, { month: 'long' })}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Year
                <input
                  type="number"
                  name="year"
                  min="2000"
                  max="2100"
                  value={filters.year}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          )}

          {filters.reportType === 'yearly' && (
            <label>
              Year
              <input
                type="number"
                name="year"
                min="2000"
                max="2100"
                value={filters.year}
                onChange={handleChange}
                required
              />
            </label>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Loading...' : 'Load Report'}
          </button>
        </div>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="dashboard-stats" aria-label="Financial summary">
        <article className="stat-tile">
          <span>Total Revenue</span>
          <strong>{loading ? '...' : formatCurrency(report?.totalRevenue)}</strong>
        </article>
        <article className="stat-tile">
          <span>Invoices</span>
          <strong>{loading ? '...' : report?.invoiceCount ?? 0}</strong>
        </article>
        <article className="stat-tile">
          <span>Items Sold</span>
          <strong>{loading ? '...' : report?.itemsSold ?? 0}</strong>
        </article>
        <article className="stat-tile">
          <span>Average Invoice</span>
          <strong>{loading ? '...' : formatCurrency(report?.averageInvoiceValue)}</strong>
        </article>
      </section>

      <div className="details-layout">
        <section className="panel">
          <div className="section-title">
            <h2>Report Summary</h2>
            <span className="count-label">{report?.period || getLabel(filters.reportType)}</span>
          </div>

          {report ? (
            <dl className="details-list">
              <div>
                <dt>Generated At</dt>
                <dd>{formatDate(report.generatedAt)}</dd>
              </div>
              <div>
                <dt>Period Start</dt>
                <dd>{formatDate(report.periodStart)}</dd>
              </div>
              <div>
                <dt>Period End</dt>
                <dd>{formatDate(report.periodEnd)}</dd>
              </div>
              <div>
                <dt>Breakdown Rows</dt>
                <dd>{report.breakdown?.length || 0}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted">No report loaded yet.</p>
          )}
        </section>

        <section className="panel">
          <div className="section-title">
            <h2>Breakdown</h2>
            <span className="count-label">{report?.breakdown?.length || 0} rows</span>
          </div>

          {loading ? (
            <p className="muted">Loading report breakdown...</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Revenue</th>
                    <th>Invoices</th>
                    <th>Items Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.breakdown?.length ? (
                    report.breakdown.map((item) => (
                      <tr key={`${item.label}-${item.periodStart}`}>
                        <td>{item.label}</td>
                        <td>{formatCurrency(item.revenue)}</td>
                        <td>{item.invoiceCount}</td>
                        <td>{item.itemsSold}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        No financial activity found for the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default FinancialReports
