import { useEffect, useState } from 'react'
import { createPart, deletePart, getParts, updatePart } from '../../services/partsService'
import { getVendors } from '../../services/vendorService'

const defaultForm = {
  name: '',
  partNumber: '',
  description: '',
  unitPrice: 0,
  stockQuantity: 0,
  reorderLevel: 10,
  preferredVendorId: '',
}

function ManageParts() {
  const [parts, setParts] = useState([])
  const [vendors, setVendors] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const loadParts = async (searchTerm = '') => {
    const data = await getParts(searchTerm)
    setParts(data)
  }

  useEffect(() => {
    const loadData = async () => {
      const vendorData = await getVendors()
      setVendors(vendorData)
      await loadParts()
    }
    loadData()
  }, [])

  const onSearch = async (e) => {
    e.preventDefault()
    await loadParts(search)
  }

  const buildPayload = () => ({
    ...form,
    unitPrice: Number(form.unitPrice),
    stockQuantity: Number(form.stockQuantity),
    reorderLevel: Number(form.reorderLevel),
    preferredVendorId: form.preferredVendorId ? Number(form.preferredVendorId) : null,
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updatePart(editingId, buildPayload())
      } else {
        await createPart(buildPayload())
      }
      setForm(defaultForm)
      setEditingId(null)
      await loadParts(search)
    } catch (err) {
      setError(err?.response?.data || 'Failed to save part.')
    }
  }

  const onEdit = (part) => {
    setEditingId(part.id)
    setForm({
      name: part.name || '',
      partNumber: part.partNumber || '',
      description: part.description || '',
      unitPrice: part.unitPrice || 0,
      stockQuantity: part.stockQuantity || 0,
      reorderLevel: part.reorderLevel || 10,
      preferredVendorId: part.preferredVendorId || '',
    })
  }

  const onDelete = async (id) => {
    try {
      await deletePart(id)
      await loadParts(search)
    } catch (err) {
      setError(err?.response?.data || 'Failed to delete part.')
    }
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Parts inventory</p>
          <h2>Manage parts</h2>
        </div>
        <p className="section-copy">Track stock, pricing, reorder levels, and preferred vendors.</p>
      </div>

      {error ? <p className="alert-message">{error}</p> : null}

      <div className="panel">
        <form className="toolbar" onSubmit={onSearch}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="secondary-button">
            Search
          </button>
        </form>
      </div>

      <div className="panel">
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="field">
            <span>Part name</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Part number</span>
            <input
              value={form.partNumber}
              onChange={(e) => setForm({ ...form, partNumber: e.target.value })}
              required
            />
          </label>
          <label className="field field-span-full">
            <span>Description</span>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Unit price</span>
            <input
              type="number"
              value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
              min="0"
              step="0.01"
              required
            />
          </label>
          <label className="field">
            <span>Current stock</span>
            <input
              type="number"
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              min="0"
              required
            />
          </label>
          <label className="field">
            <span>Reorder level</span>
            <input
              type="number"
              value={form.reorderLevel}
              onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
              min="0"
              required
            />
          </label>
          <label className="field">
            <span>Preferred vendor</span>
            <select
              value={form.preferredVendorId}
              onChange={(e) => setForm({ ...form, preferredVendorId: e.target.value })}
            >
              <option value="">No preferred vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </label>
          <div className="form-actions field-span-full">
            <button type="submit" className="primary-button">
              {editingId ? 'Update Part' : 'Add Part'}
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h3>Parts list</h3>
          <span className="panel-meta">{parts.length} items</span>
        </div>
        <div className="entity-list">
          {parts.length ? (
            parts.map((part) => (
              <article key={part.id} className="entity-row">
                <div>
                  <h4>
                    {part.name} <span className="subtle-text">({part.partNumber})</span>
                  </h4>
                  <p>
                    Stock {part.stockQuantity} • Reorder at {part.reorderLevel} • Rs. {part.unitPrice}
                  </p>
                </div>
                <div className="row-actions">
                  <button type="button" className="secondary-button" onClick={() => onEdit(part)}>
                    Edit
                  </button>
                  <button type="button" className="ghost-button" onClick={() => onDelete(part.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">No parts available yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default ManageParts
