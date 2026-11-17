import { useEffect, useState } from 'react';
import { addReview } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

/**
 * GiveReviews — review form (Task 11).
 * Includes the required "disabled after submission" behaviour: once a review
 * is successfully published, the whole form is disabled and a confirmation
 * is displayed.
 */
export default function GiveReviews() {
  const { user } = useAuth() ?? {};
  const { notify } = useNotification() ?? {};
  const [form, setForm] = useState({ name: user?.name ?? '', rating: 5, comment: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    setForm((f) => ({ ...f, name: user?.name ?? '' }));
  }, [user]);

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
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).some((k) => errs[k])) return;

    setSubmitting(true);
    try {
      await addReview({ name: form.name.trim(), rating: form.rating, comment: form.comment.trim() });
      // Submission succeeded — the form is now disabled (Task 11 behaviour).
      setSubmitted(true);
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

      {submitted && (
        <p className="banner banner-success" role="status">
          Your review has been published — thank you! The form is now disabled.
        </p>
      )}

      {/* Disabling the fieldset disables every input and the submit button */}
      <fieldset disabled={submitted || submitting} className="review-fieldset">
        <div className="field">
          <label htmlFor="rev-name">Your name</label>
          <input
            id="rev-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  checked={form.rating === n}
                  onChange={() => setForm({ ...form, rating: n })}
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
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
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
          {submitting ? 'Publishing…' : submitted ? 'Review published' : 'Publish review'}
        </button>
      </fieldset>
    </form>
  );
}
