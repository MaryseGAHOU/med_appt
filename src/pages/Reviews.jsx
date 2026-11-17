import { useEffect, useState } from 'react';
import GiveReviews from '../components/GiveReviews.jsx';
import { fetchReviews } from '../services/api.js';
import Stars from '../components/Stars.jsx';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchReviews().then((list) => {
      if (!active) return;
      setReviews(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Patient reviews</h1>
          <p className="section-sub">
            Honest feedback from real patients — publish yours in seconds.
          </p>
          {average && (
            <p className="rating-summary">
              <Stars value={Math.round(average)} />
              <span>
                <strong>{average} / 5</strong> based on {reviews.length} review
                {reviews.length === 1 ? '' : 's'}
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container reviews-layout">
          <div>
            <h2 className="section-title reviews-list-title">All reviews</h2>
            {loading ? (
              <p className="muted">Loading reviews…</p>
            ) : (
              <div className="reviews-grid">
                {reviews.map((review) => (
                  <figure className="review-card" key={review.id}>
                    <Stars value={Number(review.rating)} />
                    <blockquote>{review.comment}</blockquote>
                    <figcaption>
                      {review.name} · {review.date}
                    </figcaption>
                  </figure>
                ))}
                {reviews.length === 0 && (
                  <p className="muted">No reviews yet — be the first to share your experience!</p>
                )}
              </div>
            )}
          </div>

          <aside className="review-form-col">
            <GiveReviews />
          </aside>
        </div>
      </section>
    </>
  );
}
