import { useState } from 'react';
import Stars from './Stars.jsx';
import { cancelAppointment } from '../services/api.js';
import { db } from '../services/db.js';
import { useNotification } from '../context/NotificationContext.jsx';

/**
 * DoctorCard — doctor profile card in the booking page (Task 19).
 * The full appointment cancellation logic lives in this component:
 *  1. it calls the cancel API (with local-database fallback),
 *  2. it updates the persistent storage (localStorage via services/db.js),
 *  3. it updates the appointments state so the UI refreshes instantly.
 */
export default function DoctorCard({ doctor, appointment, setAppointments, onBook }) {
  const { notify } = useNotification() ?? {};
  const [cancelling, setCancelling] = useState(false);

  const initials = doctor.name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Cancel appointment logic — state and storage are updated right here.
  async function handleCancel() {
    if (!appointment || cancelling) return;
    setCancelling(true);
    try {
      // 1. Ask the API to delete the appointment (falls back to the local db).
      const result = await cancelAppointment(appointment.id);

      // 2. Update the persistent storage (localStorage).
      const remaining = db.getAppointments().filter((a) => a.id !== appointment.id);
      db.saveAppointments(remaining);

      // 3. Update the appointments state so the UI re-renders immediately.
      setAppointments(remaining);

      notify(result.message || 'Appointment cancelled successfully.');
    } catch (err) {
      notify(err.message || 'Cancellation failed. Please try again.', 'error');
    } finally {
      setCancelling(false);
    }
  }

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
          {/* Cancellation button — triggers the state + storage updates above */}
          <button type="button" className="btn btn-outline-dark btn-small" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? 'Cancelling…' : 'Cancel appointment'}
          </button>
        </div>
      ) : (
        onBook && (
          <div className="doctor-actions">
            <button type="button" className="btn btn-small" onClick={onBook}>
              Book appointment
            </button>
          </div>
        )
      )}
    </article>
  );
}
