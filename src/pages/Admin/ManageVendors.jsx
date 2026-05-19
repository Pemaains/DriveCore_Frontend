import { useCallback, useEffect, useState } from 'react'
import { getApiError } from '../../services/api'
import {
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
} from '../../services/vendorService'

const defaultForm = {
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  isActive: true,
}

function ManageVendors() {
  const [vendors, setVendors] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadVendors = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getVendors()
      setVendors(Array.isArray(data) ? data : [])
    } catch (err) {
      setVendors([])
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadInitialVendors() {
      try {
        setLoading(true)
        setError('')
        const data = await getVendors()

        if (!ignore) {
          setVendors(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!ignore) {
          setVendors([])
          setError(getApiError(err))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadInitialVendors()

    return () => {
      ignore = true
    }
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateVendor(editingId, form)
      } else {
        await createVendor(form)
      }
      setForm(defaultForm)
      setEditingId(null)
      await loadVendors()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  const onEdit = (vendor) => {
    setEditingId(vendor.id)
    setForm({
      name: vendor.name || '',
      contactPerson: vendor.contactPerson || '',
      phone: vendor.phone || '',
      email: vendor.email || '',
      address: vendor.address || '',
      isActive: vendor.isActive ?? true,
    })
  }

  const onDelete = async (id) => {
    try {
      setError('')
      await deleteVendor(id)
      await loadVendors()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Vendor directory</p>
          <h2>Manage vendors</h2>
        </div>
        <p className="section-copy">Maintain supplier records and keep contact details current.</p>
      </div>

      {error ? <p className="alert-message">{error}</p> : null}

      <div className="panel">
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="field">
            <span>Vendor name</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Contact person</span>
            <input
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="field field-span-full">
            <span>Address</span>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
          <label className="checkbox-field field-span-full">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <span>Vendor is active</span>
          </label>
          <div className="form-actions field-span-full">
            <button type="submit" className="primary-button">
              {editingId ? 'Update Vendor' : 'Add Vendor'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setEditingId(null)
                  setForm(defaultForm)
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h3>Vendor list</h3>
          <span className="panel-meta">{vendors.length} records</span>
        </div>
        <div className="entity-list">
          {loading ? (
            <p className="empty-state">Loading vendors...</p>
          ) : vendors.length ? (
            vendors.map((vendor) => (
              <article key={vendor.id} className="entity-row">
                <div>
                  <h4>{vendor.name}</h4>
                  <p>
                    {vendor.contactPerson || 'No contact person'} • {vendor.phone || 'No phone'} •{' '}
                    {vendor.email || 'No email'}
                  </p>
                </div>
                <div className="row-actions">
                  <span className={`status-badge ${vendor.isActive ? 'status-active' : ''}`}>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button type="button" className="secondary-button" onClick={() => onEdit(vendor)}>
                    Edit
                  </button>
                  <button type="button" className="ghost-button" onClick={() => onDelete(vendor.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">No vendors available yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default ManageVendors
