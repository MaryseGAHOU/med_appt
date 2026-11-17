import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FindDoctorSearch — doctor search functionality (Task 8).
 * The search navigates to the dedicated results route (/results) carrying the
 * selected specialty, so the patient sees the matching doctors.
 */
export default function FindDoctorSearch({ specialties = [] }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All');

  // Navigates to the results route based on the selected specialty.
  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialty && specialty !== 'All') params.set('specialty', specialty);
    if (query.trim()) params.set('name', query.trim());
    navigate(`/results?${params.toString()}`);
  }

  return (
    <form
      className="card search-bar"
      role="search"
      aria-label="Find a doctor"
      onSubmit={handleSearch}
    >
      <div className="field">
        <label htmlFor="search-name">Doctor name</label>
        <input
          id="search-name"
          type="text"
          placeholder="e.g. Dr. Sarah Mitchell"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="search-specialty">Specialty</label>
        <select
          id="search-specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        >
          <option value="All">All specialties</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="search-actions">
        <button type="submit" className="btn">Search doctors</button>
      </div>
    </form>
  );
}
