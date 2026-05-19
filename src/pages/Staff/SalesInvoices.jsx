import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerDetails } from '../../services/customerService';
import { createSalesInvoice, sendInvoiceEmail } from '../../services/invoiceService';
import { getApiError } from '../../services/api';
import { createPart, getAllParts } from '../../services/partsService';

const emptyPartForm = {
   name: '',
   partNumber: '',
   description: '',
   unitPrice: '',
   stockQuantity: '',
};

const emptyInvoiceItem = {
   partId: '',
   quantity: '1',
};

function formatCurrency(amount) {
   return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 2,
   }).format(Number(amount || 0));
}

function buildInvoiceItem(parts, item, index) {
   const matchedPart = parts.find((part) => String(part.id) === item.partId);
   const quantity = Number(item.quantity) || 0;
   const unitPrice = Number(matchedPart?.unitPrice || 0);

   return {
      ...item,
      index,
      matchedPart,
      quantity,
      unitPrice,
      lineTotal: quantity * unitPrice,
   };
}

function SalesInvoices() {
   const [parts, setParts] = useState([]);
   const [partsLoading, setPartsLoading] = useState(true);
   const [partsError, setPartsError] = useState('');
   const [partForm, setPartForm] = useState(emptyPartForm);
   const [partSaving, setPartSaving] = useState(false);
   const [partSuccess, setPartSuccess] = useState('');

   const [customerId, setCustomerId] = useState('');
   const [customer, setCustomer] = useState(null);
   const [customerLoading, setCustomerLoading] = useState(false);
   const [customerError, setCustomerError] = useState('');

   const [selectedVehicleId, setSelectedVehicleId] = useState('');
   const [invoiceItems, setInvoiceItems] = useState([{ ...emptyInvoiceItem }]);
   const [invoiceSaving, setInvoiceSaving] = useState(false);
   const [invoiceError, setInvoiceError] = useState('');
   const [invoiceSuccess, setInvoiceSuccess] = useState('');
   const [createdInvoice, setCreatedInvoice] = useState(null);
   const [sendingEmail, setSendingEmail] = useState(false);
   const [emailSuccess, setEmailSuccess] = useState('');
   const [emailError, setEmailError] = useState('');

   useEffect(() => {
      let ignore = false;

      async function loadParts() {
         try {
            setPartsLoading(true);
            const data = await getAllParts();

            if (!ignore) {
               setParts(data);
               setPartsError('');
            }
         } catch (error) {
            if (!ignore) {
               setPartsError(getApiError(error));
            }
         } finally {
            if (!ignore) {
               setPartsLoading(false);
            }
         }
      }

      loadParts();

      return () => {
         ignore = true;
      };
   }, []);

   const invoicePreviewItems = invoiceItems.map((item, index) => buildInvoiceItem(parts, item, index));
   const invoiceTotal = invoicePreviewItems.reduce((sum, item) => sum + item.lineTotal, 0);

   function handlePartFormChange(event) {
      const { name, value } = event.target;
      setPartForm((currentForm) => ({
         ...currentForm,
         [name]: value,
      }));
   }

   function handleInvoiceItemChange(index, field, value) {
      setInvoiceItems((currentItems) =>
         currentItems.map((item, itemIndex) =>
            itemIndex === index
               ? {
                    ...item,
                    [field]: value,
                 }
               : item,
         ),
      );
   }

   function addInvoiceItem() {
      setInvoiceItems((currentItems) => [...currentItems, { ...emptyInvoiceItem }]);
   }

   function removeInvoiceItem(index) {
      setInvoiceItems((currentItems) =>
         currentItems.length === 1 ? [{ ...emptyInvoiceItem }] : currentItems.filter((_, itemIndex) => itemIndex !== index),
      );
   }

   function resetInvoiceForm(keepCustomer = true) {
      setInvoiceItems([{ ...emptyInvoiceItem }]);
      setSelectedVehicleId('');
      setInvoiceError('');
      setInvoiceSuccess('');
      setCreatedInvoice(null);
      setEmailSuccess('');
      setEmailError('');

      if (!keepCustomer) {
         setCustomer(null);
         setCustomerId('');
         setCustomerError('');
      }
   }

   function validatePartForm() {
      if (!partForm.name.trim()) return 'Part name is required.';
      if (!partForm.partNumber.trim()) return 'Part number is required.';
      if (!partForm.unitPrice.trim()) return 'Unit price is required.';
      if (!partForm.stockQuantity.trim()) return 'Stock quantity is required.';

      const unitPrice = Number(partForm.unitPrice);
      if (Number.isNaN(unitPrice) || unitPrice < 0) {
         return 'Unit price must be a valid non-negative amount.';
      }

      const stockQuantity = Number(partForm.stockQuantity);
      if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
         return 'Stock quantity must be a valid non-negative whole number.';
      }

      return '';
   }

   function validateInvoiceForm() {
      if (!customer?.customerProfileId) {
         return 'Load a customer before creating an invoice.';
      }

      if (!invoiceItems.length) {
         return 'Add at least one invoice item.';
      }

      for (const item of invoiceItems) {
         if (!item.partId) {
            return 'Select a part for every invoice item.';
         }

         const quantity = Number(item.quantity);
         if (!Number.isInteger(quantity) || quantity <= 0) {
            return 'Each invoice item quantity must be greater than 0.';
         }
      }

      return '';
   }

   async function handleLoadCustomer(event) {
      event.preventDefault();

      const trimmedCustomerId = customerId.trim();
      if (!trimmedCustomerId) {
         setCustomerError('Customer ID is required.');
         return;
      }

      try {
         setCustomerLoading(true);
         setCustomerError('');
         setInvoiceError('');
         setInvoiceSuccess('');
         setCreatedInvoice(null);
         setEmailSuccess('');
         setEmailError('');

         const customerDetails = await getCustomerDetails(trimmedCustomerId);
         setCustomer(customerDetails);
         setSelectedVehicleId('');
      } catch (error) {
         setCustomer(null);
         setCustomerError(getApiError(error));
      } finally {
         setCustomerLoading(false);
      }
   }

   async function handleCreatePart(event) {
      event.preventDefault();

      const validationError = validatePartForm();
      if (validationError) {
         setPartsError(validationError);
         setPartSuccess('');
         return;
      }

      try {
         setPartSaving(true);
         setPartsError('');
         setPartSuccess('');

         const payload = {
            name: partForm.name.trim(),
            partNumber: partForm.partNumber.trim(),
            description: partForm.description.trim(),
            unitPrice: Number(partForm.unitPrice),
            stockQuantity: Number(partForm.stockQuantity),
         };

         const createdPart = await createPart(payload);
         setParts((currentParts) => [...currentParts, createdPart]);
         setPartForm(emptyPartForm);
         setPartSuccess('Part created successfully.');
      } catch (error) {
         setPartsError(getApiError(error));
      } finally {
         setPartSaving(false);
      }
   }

   async function handleCreateInvoice(event) {
      event.preventDefault();

      const validationError = validateInvoiceForm();
      if (validationError) {
         setInvoiceError(validationError);
         setInvoiceSuccess('');
         return;
      }

      try {
         setInvoiceSaving(true);
         setInvoiceError('');
         setInvoiceSuccess('');
         setEmailSuccess('');
         setEmailError('');

         const payload = {
            customerProfileId: customer.customerProfileId,
            vehicleId: selectedVehicleId ? Number(selectedVehicleId) : null,
            items: invoiceItems.map((item) => ({
               partId: Number(item.partId),
               quantity: Number(item.quantity),
            })),
         };

         const invoice = await createSalesInvoice(payload);
         setCreatedInvoice(invoice);
         setInvoiceSuccess('Sales invoice created successfully.');
         setInvoiceItems([{ ...emptyInvoiceItem }]);
         setSelectedVehicleId(invoice.vehicleId ? String(invoice.vehicleId) : '');

         setParts((currentParts) =>
            currentParts.map((part) => {
               const soldItem = invoice.items.find((item) => item.partId === part.id);
               return soldItem
                  ? {
                       ...part,
                       stockQuantity: Math.max(0, Number(part.stockQuantity || 0) - soldItem.quantity),
                    }
                  : part;
            }),
         );
      } catch (error) {
         setInvoiceError(getApiError(error));
      } finally {
         setInvoiceSaving(false);
      }
   }

   async function handleSendEmail() {
      if (!createdInvoice?.id) {
         return;
      }

      try {
         setSendingEmail(true);
         setEmailError('');
         setEmailSuccess('');
         const response = await sendInvoiceEmail(createdInvoice.id);
         setEmailSuccess(response.message || 'Invoice sent successfully.');
      } catch (error) {
         setEmailError(getApiError(error));
      } finally {
         setSendingEmail(false);
      }
   }

   return (
      <section className="page narrow-page">
         <div className="page-heading">
            <div>
               <p className="eyebrow">Staff</p>
               <h1>Sales &amp; Billing</h1>
            </div>
         </div>

         <div className="sales-grid">
            <section className="panel">
               <div className="section-title">
                  <h2>Parts Catalog</h2>
                  <span className="count-label">{parts.length} parts</span>
               </div>

               {partsError && <div className="alert alert-error">{partsError}</div>}
               {partSuccess && <div className="alert alert-success">{partSuccess}</div>}
               {partsLoading ? (
                  <p className="muted">Loading parts...</p>
               ) : (
                  <div className="table-wrap">
                     <table>
                        <thead>
                           <tr>
                              <th>Part</th>
                              <th>Description</th>
                              <th>Price</th>
                              <th>Stock</th>
                           </tr>
                        </thead>
                        <tbody>
                           {parts.length ? (
                              parts.map((part) => (
                                 <tr key={part.id}>
                                    <td>{part.name}</td>
                                    <td>{part.description || 'No description'}</td>
                                    <td>{formatCurrency(part.unitPrice)}</td>
                                    <td>{part.stockQuantity}</td>
                                 </tr>
                              ))
                           ) : (
                              <tr>
                                 <td colSpan="4" className="empty-state">
                                    No parts are available yet.
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               )}

               <form className="form-grid sales-part-form" onSubmit={handleCreatePart}>
                  <label>
                     Part name
                     <input type="text" name="name" value={partForm.name} onChange={handlePartFormChange} required />
                  </label>
                  <label>
                     Part number
                     <input type="text" name="partNumber" value={partForm.partNumber} onChange={handlePartFormChange} required />
                  </label>
                  <label>
                     Description
                     <input type="text" name="description" value={partForm.description} onChange={handlePartFormChange} />
                  </label>
                  <label>
                     Unit price
                     <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="unitPrice"
                        value={partForm.unitPrice}
                        onChange={handlePartFormChange}
                        required
                     />
                  </label>
                  <label>
                     Stock quantity
                     <input
                        type="number"
                        min="0"
                        step="1"
                        name="stockQuantity"
                        value={partForm.stockQuantity}
                        onChange={handlePartFormChange}
                        required
                     />
                  </label>

                  <div className="form-actions">
                     <button type="submit" className="secondary-button" disabled={partSaving}>
                        {partSaving ? 'Saving...' : 'Create Part'}
                     </button>
                  </div>
               </form>
            </section>

            <section className="panel form-stack">
               <section>
                  <div className="section-title">
                     <h2>Customer &amp; Vehicle</h2>
                  </div>

                  <form className="lookup-bar" onSubmit={handleLoadCustomer}>
                     <label>
                        Customer ID
                        <input type="number" min="1" value={customerId} onChange={(event) => setCustomerId(event.target.value)} required />
                     </label>
                     <button type="submit" className="primary-button" disabled={customerLoading}>
                        {customerLoading ? 'Loading...' : 'Load Customer'}
                     </button>
                  </form>

                  {customerError && <div className="alert alert-error">{customerError}</div>}

                  {customer && (
                     <div className="sales-customer-summary">
                        <div className="details-list sales-summary-list">
                           <div>
                              <dt>Customer</dt>
                              <dd>{customer.fullName}</dd>
                           </div>
                           <div>
                              <dt>Email</dt>
                              <dd>{customer.email}</dd>
                           </div>
                           <div>
                              <dt>Phone</dt>
                              <dd>{customer.phoneNumber}</dd>
                           </div>
                           <div>
                              <dt>Invoice history</dt>
                              <dd>{customer.invoices?.length || 0} invoices</dd>
                           </div>
                        </div>

                        <label>
                           Vehicle
                           <select value={selectedVehicleId} onChange={(event) => setSelectedVehicleId(event.target.value)}>
                              <option value="">Walk-in / no vehicle</option>
                              {customer.vehicles?.map((vehicle) => (
                                 <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.vehicleNumber} | {vehicle.brand} {vehicle.model}
                                 </option>
                              ))}
                           </select>
                        </label>
                     </div>
                  )}
               </section>

               <section>
                  <div className="section-title">
                     <h2>Create Invoice</h2>
                     <button type="button" className="text-button" onClick={() => resetInvoiceForm(true)}>
                        Reset Form
                     </button>
                  </div>

                  {invoiceError && <div className="alert alert-error">{invoiceError}</div>}
                  {invoiceSuccess && <div className="alert alert-success">{invoiceSuccess}</div>}

                  <form className="form-stack" onSubmit={handleCreateInvoice}>
                     <div className="sales-items">
                        {invoicePreviewItems.map((item) => (
                           <div key={item.index} className="sales-item-card">
                              <div className="sales-item-inputs">
                                 <label>
                                    Part
                                    <select
                                       value={item.partId}
                                       onChange={(event) => handleInvoiceItemChange(item.index, 'partId', event.target.value)}
                                       required
                                    >
                                       <option value="">Select a part</option>
                                       {parts.map((part) => (
                                          <option key={part.id} value={part.id}>
                                             {part.name} | Stock: {part.stockQuantity}
                                          </option>
                                       ))}
                                    </select>
                                 </label>

                                 <label>
                                    Quantity
                                    <input
                                       type="number"
                                       min="1"
                                       step="1"
                                       value={item.quantity}
                                       onChange={(event) => handleInvoiceItemChange(item.index, 'quantity', event.target.value)}
                                       required
                                    />
                                 </label>
                              </div>

                              <div className="sales-item-footer">
                                 <div className="sales-item-meta">
                                    <span>Unit price</span>
                                    <strong>{item.matchedPart ? formatCurrency(item.unitPrice) : 'Select a part'}</strong>
                                 </div>

                                 <div className="sales-item-meta">
                                    <span>Line total</span>
                                    <strong>{formatCurrency(item.lineTotal)}</strong>
                                 </div>

                                 <button
                                    type="button"
                                    className="small-button secondary sales-remove-button"
                                    onClick={() => removeInvoiceItem(item.index)}
                                 >
                                    Remove
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="sales-actions">
                        <button type="button" className="secondary-button" onClick={addInvoiceItem}>
                           Add Item
                        </button>
                        <div className="sales-total">
                           <span>Total</span>
                           <strong>{formatCurrency(invoiceTotal)}</strong>
                        </div>
                     </div>

                     <div className="form-actions">
                        <button type="submit" className="primary-button" disabled={invoiceSaving || partsLoading || customerLoading}>
                           {invoiceSaving ? 'Creating...' : 'Create Invoice'}
                        </button>
                     </div>
                  </form>
               </section>
            </section>
         </div>

         {createdInvoice && (
            <section className="panel form-stack">
               <div className="section-title">
                  <h2>Invoice Created</h2>
                  <Link to={`/staff/sales/invoices/${createdInvoice.id}`}>Open full details</Link>
               </div>

               {emailError && <div className="alert alert-error">{emailError}</div>}
               {emailSuccess && <div className="alert alert-success">{emailSuccess}</div>}

               <div className="details-list">
                  <div>
                     <dt>Invoice number</dt>
                     <dd>{createdInvoice.invoiceNumber}</dd>
                  </div>
                  <div>
                     <dt>Created at</dt>
                     <dd>{new Date(createdInvoice.createdAt).toLocaleString()}</dd>
                  </div>
                  <div>
                     <dt>Customer</dt>
                     <dd>{createdInvoice.customerName}</dd>
                  </div>
                  <div>
                     <dt>Total amount</dt>
                     <dd>{formatCurrency(createdInvoice.totalAmount)}</dd>
                  </div>
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
                        {createdInvoice.items.map((item) => (
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

               <div className="form-actions">
                  <button type="button" className="secondary-button" onClick={() => resetInvoiceForm(false)}>
                     Start New Sale
                  </button>
                  <button type="button" className="primary-button" onClick={handleSendEmail} disabled={sendingEmail}>
                     {sendingEmail ? 'Sending...' : 'Send Invoice Email'}
                  </button>
               </div>
            </section>
         )}
      </section>
   );
}

export default SalesInvoices;
