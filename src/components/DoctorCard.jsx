import Stars from './Stars.jsx';

/**
 * DoctorCard — doctor profile card in the booking page.
 * Includes the appointment cancellation logic (Task 19): when the doctor has
 * an appointment booked, a "Cancel appointment" button removes it via the API.
 */
export default function DoctorCard({ doctor, appointment, onBook, onCancel }) {
  const initials = doctor.name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <article className="card doctor-card">
      <div className="doctor-head">
        <span className="doctor-avatar" aria-hidden="true">{initials}</span>
        <div>
          <h3>{doctor.name}</h3>
          <p className="doctor-specialty">
            {doctor.specialty} · {doctor.experience} yrs experience
          </p>
          <p className="doctor-rating">
            <Stars value={Math.round(doctor.rating)} /> <span className="muted">({doctor.rating})</span>
          </p>
        </div>
      </div>

      <p className="doctor-fee">
        Consultation fee: <strong>${doctor.fee}</strong>
      </p>

      {appointment ? (
        <div className="doctor-actions">
          <p className="booked-note">
            Booked: {appointment.date} at {appointment.time}
          </p>
          {/* Cancellation logic — calls DELETE /api/appointments/:id through the data layer */}
          <button type="button" className="btn btn-outline-dark btn-small" onClick={() => onCancel(appointment)}>
            Cancel appointment
          </button>
        </div>
      ) : (
        <div className="doctor-actions">
          <button type="button" className="btn btn-small" onClick={onBook}>
            Book appointment
          </button>
        </div>
      )}
    </article>
  );
}
