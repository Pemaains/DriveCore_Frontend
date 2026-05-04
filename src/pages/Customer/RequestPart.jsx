import { useState } from 'react'
import { getApiError, partRequestApi } from '../../services/api'

const emptyPartRequestForm = {
  customerId: '',
  partName: '',
  description: '',
}

function formatDate(value) {
  if (!value) return 'Just now'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function RequestPart() {
  const [form, setForm] = useState(emptyPartRequestForm)
  const [submittedRequest, setSubmittedRequest] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function validateForm() {
    if (!form.customerId.trim()) return 'Customer ID is required.'
    if (!form.partName.trim()) return 'Part name is required.'

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setSuccess('')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const request = await partRequestApi.create({
        customerId: form.customerId.trim(),
        partName: form.partName.trim(),
        description: form.description.trim() || null,
        status: 'Pending',
      })

      setSubmittedRequest(request)
      setSuccess('Part request submitted successfully.')
      setForm(emptyPartRequestForm)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page narrow-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Customer</p>
          <h1>Request Part</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {submittedRequest && (
        <div className="details-strip">
          <span>Request #{submittedRequest.id}</span>
          <span>{submittedRequest.status || 'Pending'}</span>
        </div>
      )}

      <div className="two-column-layout customer-request-layout">
        <form className="panel form-stack" onSubmit={handleSubmit}>
          <section>
            <h2>Part Details</h2>
            <div className="form-grid single-column-form">
              <label>
                Customer ID
                <input
                  type="text"
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Part name
                <input
                  type="text"
                  name="partName"
                  value={form.partName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                />
              </label>
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>

        <section className="panel">
          <div className="section-title">
            <h2>Request Status</h2>
            <span className="count-label">
              {submittedRequest?.status || 'Pending'}
            </span>
          </div>

          {submittedRequest ? (
            <dl className="details-list request-summary-list">
              <div>
                <dt>Customer ID</dt>
                <dd>{submittedRequest.customerId}</dd>
              </div>
              <div>
                <dt>Part</dt>
                <dd>{submittedRequest.partName}</dd>
              </div>
              <div>
                <dt>Requested</dt>
                <dd>{formatDate(submittedRequest.requestedAt)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{submittedRequest.status || 'Pending'}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted">No request submitted yet.</p>
          )}
        </section>
      </div>
    </section>
  )
}

export default RequestPart
