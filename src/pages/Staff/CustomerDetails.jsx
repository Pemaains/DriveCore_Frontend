import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCustomerDetails } from '../../services/customerService'
import { customerApi, getApiError } from '../../services/api'
import { formatCurrency } from '../../utils/currency'

function CustomerDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loadedCustomerId, setLoadedCustomerId] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    if (!id) {
      return undefined
    }

    async function loadRouteCustomer() {
      try {
        setLoading(true)
        const data = await getCustomerDetails(id)

        if (!ignore) {
          setCustomer(data)
          setLoadedCustomerId(id)
          setError('')
        }
      } catch (err) {
        if (!ignore) {
          setCustomer(null)
          setLoadedCustomerId(id)
          setError(getApiError(err))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadRouteCustomer()

    return () => {
      ignore = true
    }
  }, [id])

  const isLoadingCustomer = Boolean(id) && (loading || loadedCustomerId !== id)

  async function handleSearch(event) {
    event.preventDefault()

    const query = searchTerm.trim()

    if (!query) {
      setError('Search term is required.')
      return
    }

    try {
      setSearching(true)
      setError('')
      setHasSearched(true)

      const results = await customerApi.search(query)
      setSearchResults(results)
    } catch (err) {
      setSearchResults([])
      setError(getApiError(err))
    } finally {
      setSearching(false)
    }
  }

  function handleViewCustomer(customerId) {
    setLoading(true)
    navigate(`/staff/customers/${customerId}`)
  }

  return (
    <section className="page narrow-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Customer Details</h1>
        </div>
      </div>

      <form className="lookup-bar" onSubmit={handleSearch}>
        <label>
          Search customers
          <input
            type="search"
            name="query"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="ID, name, phone, or vehicle number"
            required
          />
        </label>
        <button
          type="submit"
          className="primary-button"
          disabled={searching}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {hasSearched && (
        <section className="panel">
          <div className="section-title">
            <h2>Search Results</h2>
            <span className="count-label">{searchResults.length} records</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Vehicles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No customers matched your search.
                    </td>
                  </tr>
                ) : (
                  searchResults.map((result) => (
                    <tr key={result.customerProfileId}>
                      <td>{result.customerProfileId}</td>
                      <td>{result.fullName}</td>
                      <td>{result.phoneNumber}</td>
                      <td>
                        {result.vehicles?.map((vehicle) => vehicle.vehicleNumber).join(', ') ||
                          'None'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="small-button"
                          onClick={() => handleViewCustomer(result.customerProfileId)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {isLoadingCustomer && <p className="muted">Loading customer details...</p>}

      {id && !isLoadingCustomer && customer && (
        <div className="details-layout">
          <section className="panel">
            <div className="section-title">
              <h2>Profile</h2>
              <span className="count-label">
                ID {customer.customerProfileId}
              </span>
            </div>

            <dl className="details-list">
              <div>
                <dt>Full name</dt>
                <dd>{customer.fullName}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{customer.email}</dd>
              </div>
              <div>
                <dt>Phone number</dt>
                <dd>{customer.phoneNumber}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{customer.address}</dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <div className="section-title">
              <h2>Vehicles</h2>
              <span className="count-label">
                {customer.vehicles?.length || 0} records
              </span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle number</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Color</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.vehicles?.length ? (
                    customer.vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.vehicleNumber}</td>
                        <td>{vehicle.brand}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.color}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No vehicles found for this customer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="section-title">
              <h2>Invoice History</h2>
              <span className="count-label">
                {customer.invoices?.length || 0} invoices
              </span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Invoice number</th>
                    <th>Created at</th>
                    <th>Vehicle ID</th>
                    <th>Total amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.invoices?.length ? (
                    customer.invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>{invoice.invoiceNumber}</td>
                        <td>{new Date(invoice.createdAt).toLocaleString()}</td>
                        <td>{invoice.vehicleId || 'Not linked'}</td>
                        <td>{formatCurrency(invoice.totalAmount)}</td>
                        <td>
                          <div className="table-actions">
                            <Link to={`/staff/sales/invoices/${invoice.id}`}>View invoice</Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No invoices found for this customer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default CustomerDetails
