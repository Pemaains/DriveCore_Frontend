import { useCallback, useEffect, useState } from 'react';
import './StaffSalesDashboard.css';

const baseHeaders = {
   'Content-Type': 'application/json',
   Authorization: 'Bearer ',
};

function StaffSalesDashboard() {
   const [activeTab, setActiveTab] = useState('sales');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [successMessage, setSuccessMessage] = useState('');

   const [parts, setParts] = useState([]);
   const [newPartName, setNewPartName] = useState('');
   const [newPartPrice, setNewPartPrice] = useState(0);
   const [newPartStock, setNewPartStock] = useState(0);

   const [selectedCustomerId, setSelectedCustomerId] = useState('');
   const [cartItems, setCartItems] = useState([]);

   const fetchParts = useCallback(async () => {
      try {
         const res = await fetch('/staff/sales/parts', { headers: baseHeaders });
         if (res.ok) {
            const data = await res.json();
            setParts(data);
         }
      } catch {
         console.error('Failed to fetch parts');
      }
   }, []);

   useEffect(() => {
      let ignore = false;

      async function loadInitialParts() {
         try {
            const res = await fetch('/staff/sales/parts', { headers: baseHeaders });
            if (res.ok) {
               const data = await res.json();
               if (!ignore) {
                  setParts(data);
               }
            }
         } catch {
            console.error('Failed to fetch parts');
         }
      }

      loadInitialParts();

      return () => {
         ignore = true;
      };
   }, []);

   const handleCreatePart = async (e) => {
      e.preventDefault();
      setError('');
      setSuccessMessage('');
      setLoading(true);
      try {
         const res = await fetch('/staff/sales/parts', {
            method: 'POST',
            headers: baseHeaders,
            body: JSON.stringify({
               name: newPartName,
               unitPrice: Number(newPartPrice),
               stockQuantity: Number(newPartStock),
            }),
         });
         if (res.ok) {
            setSuccessMessage('Part created successfully!');
            setNewPartName('');
            setNewPartPrice(0);
            setNewPartStock(0);
            fetchParts();
         } else {
            const errData = await res.json();
            setError(errData.message || 'Failed to create part.');
         }
      } catch {
         setError('Error creating part');
      } finally {
         setLoading(false);
      }
   };

   const handleCreateInvoice = async () => {
      if (!selectedCustomerId || cartItems.length === 0) {
         setError('Please select a customer and add items to cart.');
         return;
      }

      setError('');
      setSuccessMessage('');
      setLoading(true);
      try {
         const res = await fetch('/staff/sales/invoices', {
            method: 'POST',
            headers: baseHeaders,
            body: JSON.stringify({
               customerProfileId: Number(selectedCustomerId),
               items: cartItems,
            }),
         });

         if (res.ok) {
            const invoiceData = await res.json();
            const sendEmail = window.confirm('Invoice  created! Send email to customer now?');
            if (sendEmail) {
               const emailRes = await fetch(`/staff/sales/invoices/${invoiceData.id}/send`, {
                  method: 'POST',
                  headers: baseHeaders,
               });
               if (emailRes.ok) setSuccessMessage('Invoice created and email sent successfully!');
               else setError('Invoice created, but failed to send email.');
            } else {
               setSuccessMessage('Invoice created successfully!');
            }
            setCartItems([]);
            fetchParts();
         } else {
            const errData = await res.json();
            setError(errData.message || 'Failed to create invoice.');
         }
      } catch {
         setError('Error creating invoice');
      } finally {
         setLoading(false);
      }
   };

   const addToCart = (partId) => {
      setCartItems((prev) => {
         const existing = prev.find((i) => i.partId === partId);
         if (existing) {
            return prev.map((i) => (i.partId === partId ? { ...i, quantity: i.quantity + 1 } : i));
         }
         return [...prev, { partId, quantity: 1 }];
      });
   };

   const [customerLookupId, setCustomerLookupId] = useState('');
   const [customerDetails, setCustomerDetails] = useState(null);

   const fetchCustomerDetails = async (e) => {
      e.preventDefault();
      if (!customerLookupId) return;
      setError('');
      setSuccessMessage('');
      setLoading(true);
      try {
         const res = await fetch(`/staff/customers/${customerLookupId}/details`, {
            headers: baseHeaders,
         });
         if (res.ok) {
            const data = await res.json();
            setCustomerDetails(data);
         } else {
            const errData = await res.json();
            setError(errData.message || 'Customer not found.');
            setCustomerDetails(null);
         }
      } catch {
         setError('Customer not found.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <section className="page dashboard-page">
         <div className="page-heading">
            <div>
               <p className="eyebrow">DriveCore Staff</p>
               <h1>Sales & Billing Dashboard</h1>
            </div>
         </div>

         {error && <div className="alert alert-error">{error}</div>}
         {successMessage && <div className="alert alert-success">{successMessage}</div>}

         <div className="dashboard-tabs">
            <button className={'tab-button '} onClick={() => setActiveTab('sales')}>
               Point of Sale
            </button>
            <button className={'tab-button '} onClick={() => setActiveTab('parts')}>
               Manage Parts
            </button>
            <button className={'tab-button '} onClick={() => setActiveTab('customers')}>
               Customer Lookup
            </button>
         </div>

         <div className="panel dashboard-panel">
            {activeTab === 'sales' && (
               <div className="pos-grid">
                  <div className="parts-list">
                     <h3>Available Parts</h3>
                     <div className="item-list">
                        {parts.map((p) => (
                           <div key={p.id} className="parts-item">
                              <div>
                                 <p className="item-name">{p.name}</p>
                                 <p className="item-meta">
                                    Stock: {p.stockQuantity} | �{p.unitPrice}
                                 </p>
                              </div>
                              <button
                                 disabled={p.stockQuantity < 1}
                                 onClick={() => addToCart(p.id)}
                                 className="secondary-button"
                                 style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                              >
                                 Add
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="cart-section">
                     <h3>Current Invoice</h3>

                     <label>
                        Customer Profile ID
                        <input
                           type="number"
                           value={selectedCustomerId}
                           onChange={(e) => setSelectedCustomerId(e.target.value)}
                           placeholder="Enter Customer ID"
                        />
                     </label>

                     <div className="cart-items-container">
                        <h4>Cart Items:</h4>
                        {cartItems.length === 0 && <p className="muted">Cart is empty.</p>}
                        {cartItems.map((item, idx) => {
                           const part = parts.find((p) => p.id === item.partId);
                           return (
                              <div key={idx} className="cart-item">
                                 <span>
                                    {part?.name} (x{item.quantity})
                                 </span>
                                 <span>�{(part?.unitPrice || 0) * item.quantity}</span>
                              </div>
                           );
                        })}
                     </div>

                     <button
                        onClick={handleCreateInvoice}
                        className="primary-button"
                        disabled={loading || cartItems.length === 0}
                        style={{ width: '100%', marginTop: '16px' }}
                     >
                        {loading ? 'Processing...' : 'Checkout & Email Invoice'}
                     </button>
                  </div>
               </div>
            )}

            {activeTab === 'parts' && (
               <form className="parts-form" onSubmit={handleCreatePart}>
                  <h3>Add New Part</h3>
                  <label>
                     Part Name
                     <input required type="text" value={newPartName} onChange={(e) => setNewPartName(e.target.value)} />
                  </label>
                  <label>
                     Unit Price (�)
                     <input required type="number" step="0.01" value={newPartPrice} onChange={(e) => setNewPartPrice(e.target.value)} />
                  </label>
                  <label>
                     Initial Stock
                     <input required type="number" value={newPartStock} onChange={(e) => setNewPartStock(e.target.value)} />
                  </label>
                  <div className="form-actions">
                     <button type="submit" className="primary-button" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Part'}
                     </button>
                  </div>
               </form>
            )}

            {activeTab === 'customers' && (
               <div className="customer-lookup">
                  <form className="lookup-bar" onSubmit={fetchCustomerDetails}>
                     <input
                        type="number"
                        value={customerLookupId}
                        onChange={(e) => setCustomerLookupId(e.target.value)}
                        placeholder="Enter Customer Profile ID"
                        required
                     />
                     <button type="submit" className="primary-button" disabled={loading}>
                        Look Up
                     </button>
                  </form>

                  {customerDetails && (
                     <div className="customer-details">
                        <div className="details-header">
                           <h3>{customerDetails.fullName}</h3>
                           <span className="badge">{customerDetails.email}</span>
                        </div>

                        <div className="details-section">
                           <h4>Registered Vehicles</h4>
                           {customerDetails.vehicles.length === 0 ? (
                              <p className="muted">No vehicles registered.</p>
                           ) : (
                              <ul>
                                 {customerDetails.vehicles.map((v) => (
                                    <li key={v.id}>
                                       {v.brand} {v.model} ({v.year}) - {v.vehicleNumber}
                                    </li>
                                 ))}
                              </ul>
                           )}
                        </div>

                        <div className="details-section">
                           <h4>Invoice History</h4>
                           {customerDetails.invoices.length === 0 ? (
                              <p className="muted">No past invoices.</p>
                           ) : (
                              <div className="invoice-list">
                                 {customerDetails.invoices.map((inv) => (
                                    <div key={inv.id} className="invoice-item">
                                       <span>
                                          {inv.invoiceNumber} � {new Date(inv.createdAt).toLocaleDateString()}
                                       </span>
                                       <span className="amount">�{inv.totalAmount}</span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </section>
   );
}

export default StaffSalesDashboard;
