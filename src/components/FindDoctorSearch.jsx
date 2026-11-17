/**
 * FindDoctorSearch — doctor search functionality inside the appointment
 * booking page (Task 8): search by doctor name and filter by specialty.
 */
export default function FindDoctorSearch({ filters, onFilterChange, specialties = [] }) {
  return (
    <div className="card search-bar" role="search" aria-label="Find a doctor">
      <div className="field">
        <label htmlFor="search-name">Doctor name</label>
        <input
          id="search-name"
          type="text"
          placeholder="e.g. Dr. Sarah Mitchell"
          value={filters.query}
          onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="search-specialty">Specialty</label>
        <select
          id="search-specialty"
          value={filters.specialty}
          onChange={(e) => onFilterChange({ ...filters, specialty: e.target.value })}
        >
          <option value="All">All specialties</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>{specialty}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
