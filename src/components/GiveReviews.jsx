import { useEffect, useState } from 'react';
import { addReview } from '../services/api.js';
import { db } from '../services/db.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

/**
 * GiveReviews — review form (Task 11).
 *
 * State model required by the rubric:
 *  - `reviewData` holds the values typed by the patient (name, rating, comment).
 *  - On submit the review is saved to state (`reviews`) and to the persistent
 *    storage (localStorage via services/db.js).
 *  - `report` stores the confirmation receipt; `report.serialNumber` is the
 *    serial number of the published review. The conditional behaviour is driven
 *    by `report.serialNumber`: while it is unset the form stays editable, and
 *    once a review is published the whole form is disabled.
 */
export default function GiveReviews() {
  const { user } = useAuth() ?? {};
  const { notify } = useNotification() ?? {};
  const [reviewData, setReviewData] = useState({
    name: user?.name ?? '',
    rating: 5,
    comment: '',
  });
  const [reviews, setReviews] = useState([]);
  const [report, setReport] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    setReviewData((data) => ({ ...data, name: user?.name ?? data.name }));
  }, [user]);

  // The form is disabled as soon as a serial number has been issued.
  const published = Boolean(report?.serialNumber);

  function validate(values) {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Please tell us your name.';
    if (!values.comment.trim()) errs.comment = 'Please write a short review.';
    else if (values.comment.trim().length < 10) errs.comment = 'Reviews need at least 10 characters.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);
    const errs = validate(reviewData);
    setErrors(errs);
    if (Object.keys(errs).some((k) => errs[k])) return;

    setSubmitting(true);
    try {
      const saved = await addReview({
        name: reviewData.name.trim(),
        rating: reviewData.rating,
        comment: reviewData.comment.trim(),
      });

      // 1. Save the review to state.
      setReviews((list) => [...list, saved]);

      // 2. Persist it in storage (localStorage).
      db.saveReviews([...db.getReviews(), saved]);

      // 3. Issue the report receipt — its serialNumber drives the
      //    conditional rendering of the banner and disables the form.
      setReport({ serialNumber: saved.id, publishedAt: new Date().toISOString() });

      notify('Thank you! Your review has been published.');
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="card form-card"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Give a review"
    >
      <h2>Give a review</h2>
      <p className="muted">Share your experience to help other patients choose their doctor.</p>

      {apiError && (
        <p className="banner banner-error" role="alert">
          {apiError}
        </p>
      )}

      {/* Conditional display driven by report.serialNumber */}
      {report?.serialNumber && (
        <p className="banner banner-success" role="status">
          Review {report.serialNumber} published — thank you! The form is now disabled.
        </p>
      )}

      {/* Disabling the fieldset disables every input and the submit button */}
      <fieldset disabled={published || submitting} className="review-fieldset">
        <div className="field">
          <label htmlFor="rev-name">Your name</label>
          <input
            id="rev-name"
            type="text"
            value={reviewData.name}
            onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'rev-name-error' : undefined}
          />
          {errors.name && (
            <p className="field-error" role="alert" id="rev-name-error">
              {errors.name}
            </p>
          )}
        </div>

        <fieldset className="field rating-field">
          <legend>Your rating</legend>
          <div className="rating-options">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={reviewData.rating === n}
                  onChange={() => setReviewData({ ...reviewData, rating: n })}
                />
                <span aria-hidden="true">{n} ★</span>
                <span className="visually-hidden">{`${n} out of 5 stars`}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="rev-comment">Your review</label>
          <textarea
            id="rev-comment"
            rows={4}
            value={reviewData.comment}
            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            placeholder="How was your consultation?"
            aria-invalid={errors.comment ? true : undefined}
            aria-describedby={errors.comment ? 'rev-comment-error' : undefined}
          />
          {errors.comment && (
            <p className="field-error" role="alert" id="rev-comment-error">
              {errors.comment}
            </p>
          )}
        </div>

        <button type="submit" className="btn btn-block">
          {submitting ? 'Publishing…' : published ? 'Review published' : 'Publish review'}
        </button>
      </fieldset>
    </form>
  );
}
