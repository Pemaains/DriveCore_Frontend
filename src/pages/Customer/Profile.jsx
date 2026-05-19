import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { customerSelfApi, getApiError } from '../../services/api'

const emptyProfileForm = {
  fullName: '',
  phoneNumber: '',
  address: '',
}

const emptyVehicleForm = {
  vehicleNumber: '',
  brand: '',
  model: '',
  year: '',
  color: '',
}

function CustomerProfile() {
  const { updateAuth } = useAuth()
  const [customer, setCustomer] = useState(null)
  const [profileForm, setProfileForm] = useState(emptyProfileForm)
  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm)
  const [editingVehicleId, setEditingVehicleId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingVehicle, setSavingVehicle] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await customerSelfApi.getProfile()
      setCustomer(data)
      setProfileForm({
        fullName: data.fullName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
      })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadInitialProfile() {
      try {
        const data = await customerSelfApi.getProfile()

        if (!ignore) {
          setCustomer(data)
          setProfileForm({
            fullName: data.fullName || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
          })
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

    loadInitialProfile()

    return () => {
      ignore = true
    }
  }, [])

  function handleProfileChange(event) {
    const { name, value } = event.target
    setProfileForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function handleVehicleChange(event) {
    const { name, value } = event.target
    setVehicleForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function validateProfile() {
    if (!profileForm.fullName.trim()) return 'Full name is required.'
    if (!profileForm.phoneNumber.trim()) return 'Phone number is required.'
    if (!profileForm.address.trim()) return 'Address is required.'

    return ''
  }

  function validateVehicle() {
    if (!vehicleForm.vehicleNumber.trim()) return 'Vehicle number is required.'
    if (!vehicleForm.brand.trim()) return 'Vehicle brand is required.'
    if (!vehicleForm.model.trim()) return 'Vehicle model is required.'
    if (!vehicleForm.year) return 'Vehicle year is required.'

    const year = Number(vehicleForm.year)
    if (Number.isNaN(year) || year < 1900 || year > 2100) {
      return 'Vehicle year must be between 1900 and 2100.'
    }

    return ''
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()

    const validationError = validateProfile()
    if (validationError) {
      setError(validationError)
      setSuccess('')
      return
    }

    try {
      setSavingProfile(true)
      setError('')
      setSuccess('')

      const updatedCustomer = await customerSelfApi.updateProfile({
        fullName: profileForm.fullName.trim(),
        phoneNumber: profileForm.phoneNumber.trim(),
        address: profileForm.address.trim(),
      })

      setCustomer(updatedCustomer)
      updateAuth({ fullName: updatedCustomer.fullName })
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleVehicleSubmit(event) {
    event.preventDefault()

    const validationError = validateVehicle()
    if (validationError) {
      setError(validationError)
      setSuccess('')
      return
    }

    const vehiclePayload = {
      vehicleNumber: vehicleForm.vehicleNumber.trim(),
      brand: vehicleForm.brand.trim(),
      model: vehicleForm.model.trim(),
      year: Number(vehicleForm.year),
      color: vehicleForm.color.trim(),
    }

    try {
      setSavingVehicle(true)
      setError('')
      setSuccess('')

      if (editingVehicleId) {
        await customerSelfApi.updateVehicle(editingVehicleId, vehiclePayload)
        setSuccess('Vehicle updated successfully.')
      } else {
        await customerSelfApi.addVehicle(vehiclePayload)
        setSuccess('Vehicle added successfully.')
      }

      resetVehicleForm()
      await loadProfile()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSavingVehicle(false)
    }
  }

  function startEditVehicle(vehicle) {
    setEditingVehicleId(vehicle.id)
    setVehicleForm({
      vehicleNumber: vehicle.vehicleNumber || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      color: vehicle.color || '',
    })
    setError('')
    setSuccess('')
  }

  function resetVehicleForm() {
    setEditingVehicleId(null)
    setVehicleForm(emptyVehicleForm)
  }

  async function deleteVehicle(vehicleId) {
    if (!window.confirm('Delete this vehicle?')) {
      return
    }

    try {
      setSavingVehicle(true)
      setError('')
      setSuccess('')

      await customerSelfApi.deleteVehicle(vehicleId)
      setSuccess('Vehicle deleted successfully.')
      resetVehicleForm()
      await loadProfile()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSavingVehicle(false)
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Customer</p>
          <h1>Profile & Vehicles</h1>
        </div>
        <button type="button" className="secondary-button" onClick={loadProfile}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <p className="muted">Loading profile...</p>
      ) : (
        <div className="two-column-layout customer-profile-layout">
          <section className="panel">
            <div className="section-title">
              <h2>Profile</h2>
              <span className="count-label">ID {customer?.customerProfileId}</span>
            </div>

            <dl className="details-list single-column-form">
              <div>
                <dt>Email</dt>
                <dd>{customer?.email}</dd>
              </div>
            </dl>

            <form className="form-grid single-column-form" onSubmit={handleProfileSubmit}>
              <label>
                Full name
                <input
                  type="text"
                  name="fullName"
                  value={profileForm.fullName}
                  onChange={handleProfileChange}
                  required
                />
              </label>

              <label>
                Phone number
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profileForm.phoneNumber}
                  onChange={handleProfileChange}
                  required
                />
              </label>

              <label>
                Address
                <textarea
                  name="address"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  rows="4"
                  required
                />
              </label>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingProfile}
                >
                  {savingProfile ? 'Saving...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </section>

          <section className="panel wide-panel">
            <div className="section-title">
              <h2>Vehicles</h2>
              <span className="count-label">{customer?.vehicles?.length || 0} records</span>
            </div>

            <form className="form-grid vehicle-form" onSubmit={handleVehicleSubmit}>
              <label>
                Vehicle number
                <input
                  type="text"
                  name="vehicleNumber"
                  value={vehicleForm.vehicleNumber}
                  onChange={handleVehicleChange}
                  required
                />
              </label>

              <label>
                Brand
                <input
                  type="text"
                  name="brand"
                  value={vehicleForm.brand}
                  onChange={handleVehicleChange}
                  required
                />
              </label>

              <label>
                Model
                <input
                  type="text"
                  name="model"
                  value={vehicleForm.model}
                  onChange={handleVehicleChange}
                  required
                />
              </label>

              <label>
                Year
                <input
                  type="number"
                  name="year"
                  min="1900"
                  max="2100"
                  value={vehicleForm.year}
                  onChange={handleVehicleChange}
                  required
                />
              </label>

              <label>
                Color
                <input
                  type="text"
                  name="color"
                  value={vehicleForm.color}
                  onChange={handleVehicleChange}
                />
              </label>

              <div className="form-actions">
                {editingVehicleId && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={resetVehicleForm}
                    disabled={savingVehicle}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingVehicle}
                >
                  {savingVehicle
                    ? 'Saving...'
                    : editingVehicleId
                      ? 'Update Vehicle'
                      : 'Add Vehicle'}
                </button>
              </div>
            </form>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle number</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Color</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customer?.vehicles?.length ? (
                    customer.vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.vehicleNumber}</td>
                        <td>{vehicle.brand}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.color}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="small-button"
                              onClick={() => startEditVehicle(vehicle)}
                              disabled={savingVehicle}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="small-button secondary"
                              onClick={() => deleteVehicle(vehicle.id)}
                              disabled={savingVehicle}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        No vehicles found.
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

export default CustomerProfile
