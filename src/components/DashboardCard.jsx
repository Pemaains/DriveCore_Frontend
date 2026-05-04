import { Link } from 'react-router-dom'

function DashboardCard({ accent = 'teal', description, eyebrow, meta, title, to }) {
  const className = `dashboard-card accent-${accent}${to ? '' : ' disabled'}`
  const content = (
    <>
      <div>
        {eyebrow && <p className="card-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="dashboard-card-footer">
        <span>{meta}</span>
        {to && <span aria-hidden="true">Open</span>}
      </div>
    </>
  )

  if (!to) {
    return <article className={className}>{content}</article>
  }

  return (
    <Link className={className} to={to}>
      {content}
    </Link>
  )
}

export default DashboardCard
