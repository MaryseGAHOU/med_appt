import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard.jsx';
import { fetchDoctors } from '../services/api.js';

/**
 * Results page — the target of the doctor search (Task 8). It shows the
 * doctors matching the selected specialty (and name) from the query string.
 */
export default function Results() {
  const [searchParams] = useSearchParams();
  const specialty = searchParams.get('specialty') || 'All';
  const name = (searchParams.get('name') || '').toLowerCase();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchDoctors().then((list) => {
      if (!active) return;
      setDoctors(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = doctors.filter(
    (d) =>
      (specialty === 'All' || d.specialty === specialty) &&
      d.name.toLowerCase().includes(name)
  );

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Search results</h1>
          <p className="section-sub">
            {specialty === 'All' ? 'All specialties' : specialty}
            {name ? ` · “${name}”` : ''} — {filtered.length} doctor
            {filtered.length === 1 ? '' : 's'} found
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <p className="muted">Loading doctors…</p>
          ) : (
            <div className="doctors-grid">
              {filtered.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} onBook={null} />
              ))}
              {filtered.length === 0 && (
                <p className="muted">
                  No doctors match this search. <Link to="/appointments">Try another search</Link>.
                </p>
              )}
            </div>
          )}
          <p className="center">
            <Link to="/appointments" className="btn btn-outline-dark">Back to booking</Link>
          </p>
        </div>
      </section>
    </>
  );
}
