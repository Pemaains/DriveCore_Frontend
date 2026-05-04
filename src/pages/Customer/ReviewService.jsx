import { useState } from 'react'
import { getApiError, reviewApi } from '../../services/api'

const emptyReviewForm = {
  customerId: '',
  rating: 0,
  comment: '',
}

const ratingLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
}

function formatDate(value) {
  if (!value) return 'Just now'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function ReviewService() {
  const [form, setForm] = useState(emptyReviewForm)
  const [submittedReview, setSubmittedReview] = useState(null)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function validateForm() {
    if (!form.customerId.trim()) return 'Customer ID is required.'
    if (!form.rating) return 'Please select a rating before submitting.'
    if (!form.comment.trim()) return 'Comment is required.'

    return ''
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

      const review = await reviewApi.create({
        customerId: form.customerId.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
      })

      setSubmittedReview(review)
      setSuccess('Review submitted successfully.')
      setForm(emptyReviewForm)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  const visibleRating = hoveredRating || form.rating

  return (
    <section className="page narrow-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Feedback</p>
          <h1>Service Review</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {submittedReview && (
        <div className="details-strip">
          <span>Review #{submittedReview.id}</span>
          <span>Submitted</span>
        </div>
      )}

      <div className="two-column-layout customer-request-layout">
        <form className="panel form-stack" onSubmit={handleSubmit}>
          <section>
            <h2>Your Experience</h2>
            <div className="form-grid single-column-form">
              <label>
                Customer ID
                <input
                  type="text"
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Rating
                <span className="rating-wrapper">
                  <span className="stars" onMouseLeave={() => setHoveredRating(0)}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className={
                          rating <= visibleRating
                            ? 'star-button selected'
                            : 'star-button'
                        }
                        onClick={() =>
                          setForm((currentForm) => ({
                            ...currentForm,
                            rating,
                          }))
                        }
                        onMouseEnter={() => setHoveredRating(rating)}
                        aria-label={`${rating} star rating`}
                      >
                        ★
                      </button>
                    ))}
                  </span>
                  <span className="rating-label">
                    {visibleRating
                      ? ratingLabels[visibleRating]
                      : 'Select a rating'}
                  </span>
                </span>
              </label>

              <label>
                Comment
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </label>
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>

        <section className="panel">
          <div className="section-title">
            <h2>Review Status</h2>
            <span className="count-label">
              {submittedReview ? 'Submitted' : 'Awaiting'}
            </span>
          </div>

          {submittedReview ? (
            <dl className="details-list request-summary-list">
              <div>
                <dt>Customer ID</dt>
                <dd>{submittedReview.customerId}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>
                  {submittedReview.rating} / 5 -{' '}
                  {ratingLabels[submittedReview.rating]}
                </dd>
              </div>
              <div>
                <dt>Comment</dt>
                <dd>{submittedReview.comment}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{formatDate(submittedReview.createdAt)}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted">
              Share your experience to help improve future services.
            </p>
          )}
        </section>
      </div>
    </section>
  )
}

export default ReviewService
