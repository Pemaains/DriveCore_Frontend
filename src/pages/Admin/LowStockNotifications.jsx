import { useCallback, useEffect, useState } from 'react'
import { getApiError, notificationApi } from '../../services/api'

function formatDate(value) {
    if (!value) return 'Unknown'
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

function LowStockNotifications() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const data = await notificationApi.getLowStock()
            setNotifications(data)
        } catch (err) {
            setError(getApiError(err))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadNotifications()
    }, [loadNotifications])

    async function handleMarkAsRead(id) {
        try {
            setSaving(true)
            setError('')
            await notificationApi.markAsRead(id)
            setSuccess('Notification marked as read.')
            await loadNotifications()
        } catch (err) {
            setError(getApiError(err))
        } finally {
            setSaving(false)
        }
    }

    async function handleMarkAllAsRead() {
        try {
            setSaving(true)
            setError('')
            const result = await notificationApi.markAllAsRead()
            setSuccess(`${result.marked} notifications marked as read.`)
            await loadNotifications()
        } catch (err) {
            setError(getApiError(err))
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id) {
        try {
            setSaving(true)
            setError('')
            await notificationApi.delete(id)
            setSuccess('Notification dismissed.')
            await loadNotifications()
        } catch (err) {
            setError(getApiError(err))
        } finally {
            setSaving(false)
        }
    }

    const unreadCount = notifications.filter(n => !n.isRead).length

    return (
        <section className="page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Admin</p>
                    <h1>Low Stock Notifications</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={handleMarkAllAsRead}
                            disabled={saving}
                        >
                            Mark all as read
                        </button>
                    )}
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={loadNotifications}
                        disabled={loading}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="dashboard-stats">
                <article className="stat-tile">
                    <span>Total Alerts</span>
                    <strong>{loading ? '...' : notifications.length}</strong>
                </article>
                <article className="stat-tile">
                    <span>Unread</span>
                    <strong>{loading ? '...' : unreadCount}</strong>
                </article>
                <article className="stat-tile">
                    <span>Read</span>
                    <strong>{loading ? '...' : notifications.length - unreadCount}</strong>
                </article>
                <article className="stat-tile">
                    <span>Threshold</span>
                    <strong>10</strong>
                </article>
            </div>

            <section className="panel">
                <div className="section-title">
                    <h2>Stock Alerts</h2>
                    <span className="count-label">{notifications.length} alerts</span>
                </div>

                {loading ? (
                    <p className="muted">Loading notifications...</p>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Part Name</th>
                                    <th>Current Stock</th>
                                    <th>Threshold</th>
                                    <th>Notified At</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="empty-state">
                                            No low stock notifications.
                                        </td>
                                    </tr>
                                ) : (
                                    notifications.filter(n => n.partName).map((notification) => (
                                        <tr key={notification.id}>
                                            <td>{notification.partName}</td>
                                            <td>
                                                <span style={{
                                                    color: notification.currentStock <= 5 ? '#8a3a3a' : '#7a6020',
                                                    fontWeight: '600'
                                                }}>
                                                    {notification.currentStock} units
                                                </span>
                                            </td>
                                            <td>{notification.threshold} units</td>
                                            <td>{formatDate(notification.notifiedAt)}</td>
                                            <td>
                                                <span className={notification.isRead ? 'status-badge active' : 'status-badge inactive'}>
                                                    {notification.isRead ? 'Read' : 'Unread'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    {!notification.isRead && (
                                                        <button
                                                            type="button"
                                                            className="small-button"
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            disabled={saving}
                                                        >
                                                            Mark Read
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="small-button secondary"
                                                        onClick={() => handleDelete(notification.id)}
                                                        disabled={saving}
                                                    >
                                                        Dismiss
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
        </section>
    )
}

export default LowStockNotifications