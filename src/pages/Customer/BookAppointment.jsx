import { useMemo, useState } from 'react'
import { appointmentApi, getApiError } from '../../services/api'

const emptyAppointmentForm = {
  customerId: '',
  appointmentDate: '',
  serviceType: '',
  notes: '',
}

const serviceTypes = [
  'General Service',
  'Oil Change',
  'Brake Inspection',
  'Engine Diagnostics',
  'Battery Check',
  'Tire Service',
  'AC Repair',
  'Other',
]

function toDateTimeInputValue(date) {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)

  return localDate.toISOString().slice(0, 16)
}

function formatDate(value) {
  if (!value) return 'Not scheduled'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function BookAppointment() {
  const [form, setForm] = useState(emptyAppointmentForm)
  const [bookedAppointment, setBookedAppointment] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const minimumAppointmentDate = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)

    return toDateTimeInputValue(tomorrow)
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function validateForm() {
    if (!form.customerId.trim()) return 'Customer ID is required.'
    if (!form.appointmentDate) return 'Appointment date and time are required.'
    if (!form.serviceType) return 'Service type is required.'

    const appointmentDate = new Date(form.appointmentDate)
    if (Number.isNaN(appointmentDate.getTime())) {
      return 'Appointment date and time are invalid.'
    }

    if (appointmentDate <= new Date()) {
      return 'Appointment date and time must be in the future.'
    }

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

      const appointment = await appointmentApi.create({
        customerId: form.customerId.trim(),
        appointmentDate: new Date(form.appointmentDate).toISOString(),
        serviceType: form.serviceType,
        status: 'Pending',
        notes: form.notes.trim() || null,
      })

      setBookedAppointment(appointment)
      setSuccess('Appointment booked successfully.')
      setForm(emptyAppointmentForm)
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
          <h1>Book Appointment</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {bookedAppointment && (
        <div className="details-strip">
          <span>Appointment #{bookedAppointment.id}</span>
          <span>{bookedAppointment.status || 'Pending'}</span>
        </div>
      )}

      <div className="two-column-layout customer-request-layout">
        <form className="panel form-stack" onSubmit={handleSubmit}>
          <section>
            <h2>Appointment Details</h2>
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
                Date and time
                <input
                  type="datetime-local"
                  name="appointmentDate"
                  min={minimumAppointmentDate}
                  value={form.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Service type
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select service</option>
                  {serviceTypes.map((serviceType) => (
                    <option key={serviceType} value={serviceType}>
                      {serviceType}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Notes
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="5"
                />
              </label>
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>

        <section className="panel">
          <div className="section-title">
            <h2>Booking Status</h2>
            <span className="count-label">
              {bookedAppointment?.status || 'Pending'}
            </span>
          </div>

          {bookedAppointment ? (
            <dl className="details-list request-summary-list">
              <div>
                <dt>Customer ID</dt>
                <dd>{bookedAppointment.customerId}</dd>
              </div>
              <div>
                <dt>Service</dt>
                <dd>{bookedAppointment.serviceType}</dd>
              </div>
              <div>
                <dt>Scheduled</dt>
                <dd>{formatDate(bookedAppointment.appointmentDate)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{bookedAppointment.status || 'Pending'}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted">No appointment booked yet.</p>
          )}
        </section>
      </div>
    </section>
  )
}

export default BookAppointment
