import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDoctors, fetchReviews } from '../services/api.js';
import Stars from '../components/Stars.jsx';

const PERKS = [
  { icon: '🩺', title: 'Verified doctors', text: 'Every doctor on StayHealthy is licensed and reviewed by our medical team.' },
  { icon: '⚡', title: 'Booking in 60 seconds', text: 'Pick a doctor, a date and a time — confirmation arrives instantly.' },
  { icon: '🌍', title: 'Care from anywhere', text: 'Reach doctors remotely, even from underserved and remote areas.' },
];

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([fetchDoctors(), fetchReviews()]).then(([docs, revs]) => {
      if (!active) return;
      setDoctors(docs.slice(0, 3));
      setReviews(revs.slice(0, 3));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Nonprofit health platform</p>
            <h1>
              Quality healthcare, <em>anywhere</em> you are
            </h1>
            <p className="lede">
              StayHealthy connects patients with trusted doctors online. Search by specialty,
              book an appointment or request an instant consultation — in under a minute.
            </p>
            <div className="hero-actions">
              <Link to="/appointments" className="btn">Book an appointment</Link>
              <Link to="/signup" className="btn btn-outline-light">Sign Up</Link>
            </div>
            <p className="hero-note">
              <Stars value={5} /> Trusted by thousands of patients
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="tile tile-a">🩺</div>
            <div className="tile tile-b">📅</div>
            <div className="tile tile-c">💊</div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="perks-title">
        <div className="container">
          <h2 id="perks-title" className="section-title">Why patients choose StayHealthy</h2>
          <div className="perks-grid">
            {PERKS.map((perk) => (
              <div className="perk" key={perk.title}>
                <span aria-hidden="true">{perk.icon}</span>
                <h3>{perk.title}</h3>
                <p>{perk.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="doctors-title">
        <div className="container">
          <h2 id="doctors-title" className="section-title">Meet our doctors</h2>
          <p className="section-sub">A selection of the specialists available on the platform.</p>
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <article className="card doctor-card" key={doctor.id}>
                <div className="doctor-head">
                  <span className="doctor-avatar" aria-hidden="true">
                    {doctor.name.replace(/^Dr\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <h3>{doctor.name}</h3>
                    <p className="doctor-specialty">{doctor.specialty}</p>
                    <p className="doctor-rating">
                      <Stars value={Math.round(doctor.rating)} />
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="center">
            <Link to="/appointments" className="btn btn-outline-dark">See all doctors &amp; book</Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="reviews-preview-title">
        <div className="container">
          <h2 id="reviews-preview-title" className="section-title">What patients say</h2>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <figure className="review-card" key={review.id}>
                <Stars value={review.rating} />
                <blockquote>{review.comment}</blockquote>
                <figcaption>{review.name}</figcaption>
              </figure>
            ))}
          </div>
          <p className="center">
            <Link to="/reviews" className="btn btn-outline-dark">Read all reviews</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-panel">
            <div>
              <h2>Need a doctor today?</h2>
              <p>Search by specialty and book instantly — no phone queue, no waiting room.</p>
            </div>
            <Link to="/appointments" className="btn btn-big">Book now</Link>
          </div>
        </div>
      </section>
    </>
  );
}
