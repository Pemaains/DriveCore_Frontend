import { useEffect, useState } from 'react'
import { customerApi, getApiError } from '../../services/api'

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

function PurchaseHistory() {
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadHistory() {
      try {
        const data = await customerApi.getHistory()

        if (!ignore) {
          setHistory(data)
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

    loadHistory()

    return () => {
      ignore = true
    }
  }, [])

  async function refreshHistory() {
    try {
      setLoading(true)
      setError('')
      const data = await customerApi.getHistory()
      setHistory(data)
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
          <p className="eyebrow">Customer</p>
          <h1>Purchase & Service History</h1>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={refreshHistory}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="dashboard-stats" aria-label="History summary">
        <article className="stat-tile">
          <span>Purchases</span>
          <strong>{loading ? '...' : history?.totalPurchaseCount ?? 0}</strong>
        </article>
        <article className="stat-tile">
          <span>Purchase Total</span>
          <strong>{loading ? '...' : formatCurrency(history?.totalPurchaseAmount)}</strong>
        </article>
        <article className="stat-tile">
          <span>Services</span>
          <strong>{loading ? '...' : history?.totalServiceCount ?? 0}</strong>
        </article>
        <article className="stat-tile">
          <span>Customer ID</span>
          <strong>{loading ? '...' : history?.customerProfileId ?? 0}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Purchase History</h2>
          <span className="count-label">{history?.purchases?.length || 0} invoices</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {history?.purchases?.length ? (
                history.purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.invoiceNumber}</td>
                    <td>{formatDate(purchase.createdAt)}</td>
                    <td>{purchase.vehicleNumber || 'Not linked'}</td>
                    <td>
                      <div className="history-item-list">
                        {purchase.items.map((item) => (
                          <div key={`${purchase.id}-${item.partId}`}>
                            {item.partName} x {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>{formatCurrency(purchase.totalAmount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No purchase history found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Service History</h2>
          <span className="count-label">{history?.services?.length || 0} services</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Appointment</th>
                <th>Service</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {history?.services?.length ? (
                history.services.map((service) => (
                  <tr key={service.id}>
                    <td>#{service.id}</td>
                    <td>{service.serviceType}</td>
                    <td>{formatDate(service.appointmentDate)}</td>
                    <td>
                      <span className={service.status === 'Completed' ? 'status-badge active' : 'status-badge inactive'}>
                        {service.status}
                      </span>
                    </td>
                    <td>{service.notes || 'No notes provided.'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No service history found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

export default PurchaseHistory
