import { useCallback, useEffect, useState } from 'react'
import { getApiError, staffApi } from '../../services/api'

const emptyStaffForm = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: 'Staff',
  staffCode: '',
  position: '',
  isActive: true,
}

const roleNames = ['Admin', 'Staff', 'Customer']

function normalizeRole(role) {
  return typeof role === 'number' ? roleNames[role] : role
}

function ManageStaff() {
  const [staffList, setStaffList] = useState([])
  const [form, setForm] = useState(emptyStaffForm)
  const [editingStaff, setEditingStaff] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadStaff = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const staff = await staffApi.getAll()
      setStaffList(staff)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadInitialStaff() {
      try {
        const staff = await staffApi.getAll()

        if (!ignore) {
          setStaffList(staff)
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

    loadInitialStaff()

    return () => {
      ignore = true
    }
  }, [])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function validateForm() {
    if (!form.fullName.trim()) return 'Full name is required.'
    if (!form.email.trim()) return 'Email is required.'
    if (!form.phoneNumber.trim()) return 'Phone number is required.'
    if (!editingStaff && !form.password.trim()) return 'Password is required.'
    if (!form.role) return 'Role is required.'
    if (!form.staffCode.trim()) return 'Staff code is required.'
    if (!form.position.trim()) return 'Position is required.'

    return ''
  }

  function resetForm() {
    setForm(emptyStaffForm)
    setEditingStaff(null)
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

      if (editingStaff) {
        await staffApi.update(editingStaff.userId, {
          fullName: form.fullName.trim(),
          phoneNumber: form.phoneNumber.trim(),
          position: form.position.trim(),
        })

        if (normalizeRole(editingStaff.role) !== form.role) {
          await staffApi.updateRole(editingStaff.userId, form.role)
        }

        if (editingStaff.isActive !== form.isActive) {
          await staffApi.updateStatus(editingStaff.userId, form.isActive)
        }

        setSuccess('Staff details updated successfully.')
      } else {
        const createdStaff = await staffApi.create({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          password: form.password,
          role: form.role,
          staffCode: form.staffCode.trim(),
          position: form.position.trim(),
        })

        if (!form.isActive) {
          await staffApi.updateStatus(createdStaff.userId, false)
        }

        setSuccess('Staff account registered successfully.')
      }

      resetForm()
      await loadStaff()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  async function startEdit(staff) {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const latestStaff = await staffApi.getById(staff.userId)
      setEditingStaff(latestStaff)
      setForm({
        fullName: latestStaff.fullName || '',
        email: latestStaff.email || '',
        phoneNumber: latestStaff.phoneNumber || '',
        password: '',
        role: normalizeRole(latestStaff.role) || 'Staff',
        staffCode: latestStaff.staffCode || '',
        position: latestStaff.position || '',
        isActive: Boolean(latestStaff.isActive),
      })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(staff) {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      await staffApi.updateStatus(staff.userId, !staff.isActive)
      setSuccess(
        staff.isActive
          ? 'Staff account deactivated successfully.'
          : 'Staff account activated successfully.',
      )
      await loadStaff()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Staff Management</h1>
        </div>
        <button type="button" className="secondary-button" onClick={loadStaff}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="two-column-layout">
        <section className="panel">
          <div className="section-title">
            <h2>{editingStaff ? 'Edit Staff' : 'Register Staff'}</h2>
            {editingStaff && (
              <button
                type="button"
                className="text-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel edit
              </button>
            )}
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={Boolean(editingStaff)}
                required
              />
            </label>

            <label>
              Phone number
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={Boolean(editingStaff)}
                required={!editingStaff}
              />
            </label>

            <label>
              Role
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <label>
              Staff code
              <input
                type="text"
                name="staffCode"
                value={form.staffCode}
                onChange={handleChange}
                disabled={Boolean(editingStaff)}
                required
              />
            </label>

            <label>
              Position
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                required
              />
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Is active
            </label>

            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={saving}>
                {saving
                  ? 'Saving...'
                  : editingStaff
                    ? 'Update Staff'
                    : 'Register Staff'}
              </button>
            </div>
          </form>
        </section>

        <section className="panel wide-panel">
          <div className="section-title">
            <h2>All Staff</h2>
            <span className="count-label">{staffList.length} records</span>
          </div>

          {loading ? (
            <p className="muted">Loading staff...</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Code</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        No staff records found.
                      </td>
                    </tr>
                  ) : (
                    staffList.map((staff) => (
                      <tr key={staff.userId}>
                        <td>{staff.fullName}</td>
                        <td>{staff.email}</td>
                        <td>{staff.phoneNumber}</td>
                        <td>{normalizeRole(staff.role)}</td>
                        <td>{staff.staffCode}</td>
                        <td>{staff.position}</td>
                        <td>
                          <span
                            className={
                              staff.isActive
                                ? 'status-badge active'
                                : 'status-badge inactive'
                            }
                          >
                            {staff.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="small-button"
                              onClick={() => startEdit(staff)}
                              disabled={saving}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="small-button secondary"
                              onClick={() => toggleStatus(staff)}
                              disabled={saving}
                            >
                              {staff.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default ManageStaff
