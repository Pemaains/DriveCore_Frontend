import { useEffect, useState } from 'react'
import { getParts } from '../../services/partsService'
import { createPurchaseInvoice, getPurchaseInvoices } from '../../services/purchaseInvoiceService'
import { getVendors } from '../../services/vendorService'

const defaultForm = {
  invoiceNumber: '',
  vendorId: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  notes: '',
}

const defaultItem = { partId: '', quantity: 1, unitCost: 0 }

function PurchaseInvoices() {
  const [vendors, setVendors] = useState([])
  const [parts, setParts] = useState([])
  const [invoices, setInvoices] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [items, setItems] = useState([defaultItem])
  const [error, setError] = useState('')

  const loadData = async () => {
    const [vendorData, partData, invoiceData] = await Promise.all([
      getVendors(),
      getParts(),
      getPurchaseInvoices(),
    ])
    setVendors(vendorData)
    setParts(partData)
    setInvoices(invoiceData)
  }

  useEffect(() => {
    const initializePage = async () => {
      await loadData()
    }

    initializePage()
  }, [])

  const updateItem = (index, field, value) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    setItems(next)
  }

  const addRow = () => setItems([...items, { ...defaultItem }])
  const removeRow = (index) => setItems(items.filter((_, i) => i !== index))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        vendorId: Number(form.vendorId),
        purchaseDate: new Date(form.purchaseDate).toISOString(),
        items: items.map((item) => ({
          partId: Number(item.partId),
          quantity: Number(item.quantity),
          unitCost: Number(item.unitCost),
        })),
      }
      await createPurchaseInvoice(payload)
      setForm(defaultForm)
      setItems([defaultItem])
      await loadData()
    } catch (err) {
      setError(err?.response?.data || 'Failed to create invoice.')
    }
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Purchase flow</p>
          <h2>Purchase invoices</h2>
        </div>
        <p className="section-copy">Record incoming purchases and keep invoice history organized.</p>
      </div>

      {error ? <p className="alert-message">{error}</p> : null}

      <div className="panel">
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="field">
            <span>Invoice number</span>
            <input
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Vendor</span>
            <select
              value={form.vendorId}
              onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
              required
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Purchase date</span>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              required
            />
          </label>
          <label className="field field-span-full">
            <span>Notes</span>
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>

          <div className="field-span-full invoice-items">
            <div className="panel-heading">
              <h3>Invoice items</h3>
              <button type="button" className="secondary-button" onClick={addRow}>
                Add Item Row
              </button>
            </div>
            <div className="invoice-item-list">
              {items.map((item, index) => (
                <div key={`${index}-${item.partId}`} className="invoice-item-row">
                  <label className="field">
                    <span>Part</span>
                    <select
                      value={item.partId}
                      onChange={(e) => updateItem(index, 'partId', e.target.value)}
                      required
                    >
                      <option value="">Select part</option>
                      {parts.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.name} ({part.partNumber})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Quantity</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      required
                    />
                  </label>
                  <label className="field">
                    <span>Unit cost</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitCost}
                      onChange={(e) => updateItem(index, 'unitCost', e.target.value)}
                      required
                    />
                  </label>
                  {items.length > 1 ? (
                    <button type="button" className="ghost-button invoice-remove" onClick={() => removeRow(index)}>
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions field-span-full">
            <button type="submit" className="primary-button">
              Create Purchase Invoice
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h3>Invoice history</h3>
          <span className="panel-meta">{invoices.length} invoices</span>
        </div>
        <div className="entity-list">
          {invoices.length ? (
            invoices.map((invoice) => (
              <article key={invoice.id} className="entity-row">
                <div>
                  <h4>{invoice.invoiceNumber}</h4>
                  <p>
                    {invoice.vendor?.name || 'Unknown vendor'} • Rs. {invoice.totalAmount} •{' '}
                    {invoice.items?.length || 0} items
                  </p>
                </div>
                <span className="status-badge">{new Date(invoice.purchaseDate).toLocaleDateString()}</span>
              </article>
            ))
          ) : (
            <p className="empty-state">No invoices recorded yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default PurchaseInvoices
