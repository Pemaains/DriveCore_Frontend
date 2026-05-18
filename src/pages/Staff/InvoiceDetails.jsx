import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getInvoiceById, sendInvoiceEmail } from '../../services/invoiceService'
import { getApiError } from '../../services/api'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 2,
  }).format(Number(amount || 0))
}

function InvoiceDetails() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState('')
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadInvoice() {
      try {
        setLoading(true)
        const data = await getInvoiceById(id)

        if (!ignore) {
          setInvoice(data)
          setError('')
        }
      } catch (loadError) {
        if (!ignore) {
          setInvoice(null)
          setError(getApiError(loadError))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadInvoice()

    return () => {
      ignore = true
    }
  }, [id])

  async function handleSendEmail() {
    if (!invoice?.id) {
      return
    }

    try {
      setSendingEmail(true)
      setEmailError('')
      setEmailSuccess('')
      const response = await sendInvoiceEmail(invoice.id)
      setEmailSuccess(response.message || 'Invoice sent successfully.')
    } catch (sendError) {
      setEmailError(getApiError(sendError))
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <section className="page narrow-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Invoice Details</h1>
        </div>
        <Link to="/staff/sales/invoices">Back to sales</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {emailError && <div className="alert alert-error">{emailError}</div>}
      {emailSuccess && <div className="alert alert-success">{emailSuccess}</div>}

      {loading && <p className="muted">Loading invoice details...</p>}

      {!loading && invoice && (
        <div className="details-layout">
          <section className="panel">
            <div className="section-title">
              <h2>Summary</h2>
              <span className="count-label">{invoice.invoiceNumber}</span>
            </div>

            <div className="details-list">
              <div>
                <dt>Invoice ID</dt>
                <dd>{invoice.id}</dd>
              </div>
              <div>
                <dt>Created at</dt>
                <dd>{new Date(invoice.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt>Customer</dt>
                <dd>{invoice.customerName}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{invoice.customerEmail}</dd>
              </div>
              <div>
                <dt>Customer profile ID</dt>
                <dd>{invoice.customerProfileId}</dd>
              </div>
              <div>
                <dt>Vehicle ID</dt>
                <dd>{invoice.vehicleId || 'Not linked'}</dd>
              </div>
              <div>
                <dt>Total amount</dt>
                <dd>{formatCurrency(invoice.totalAmount)}</dd>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="primary-button"
                onClick={handleSendEmail}
                disabled={sendingEmail}
              >
                {sendingEmail ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </section>

          <section className="panel">
            <div className="section-title">
              <h2>Items</h2>
              <span className="count-label">{invoice.items.length} lines</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Part</th>
                    <th>Quantity</th>
                    <th>Unit price</th>
                    <th>Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.partName}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{formatCurrency(item.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default InvoiceDetails
