import DashboardCard from '../../components/DashboardCard'

const customerFeatures = [
  {
    title: 'Book Appointment',
    description:
      'Schedule a service appointment for your vehicle at your preferred date and time.',
    eyebrow: 'Scheduling',
    meta: 'Available now',
    to: '/customer/book-appointment',
  },
  {
    title: 'Request Part',
    description:
      "Submit a request for an unavailable part and we'll source it for you.",
    eyebrow: 'Procurement',
    meta: 'Available now',
    to: '/customer/request-part',
  },
  {
    title: 'Service Reviews',
    description:
      'Rate and review the services you have received. Your feedback matters.',
    eyebrow: 'Feedback',
    meta: 'Available now',
    to: '/my-reviews',
  },
]

function CustomerDashboard() {
  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Customer Portal</p>
          <h1>Welcome back.</h1>
        </div>
        <span className="count-label">3 services</span>
      </div>

      <p className="muted">
        Manage your vehicle services, parts, and feedback from one place.
      </p>

      <section className="dashboard-grid" aria-label="Customer services">
        {customerFeatures.map((feature) => (
          <DashboardCard key={feature.to} {...feature} />
        ))}
      </section>
    </section>
  )
}

export default CustomerDashboard
