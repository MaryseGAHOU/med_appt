import { useEffect, useState } from 'react';
import { bookAppointment } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { todayISO } from '../utils/validate.js';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

/**
 * AppointmentForm — the full appointment booking form (Task 18):
 * Name, Phone Number, Date and Time (+ doctor selection).
 */
export default function AppointmentForm({ doctors = [], selectedDoctorId = '', onBooked }) {
  const { user } = useAuth() ?? {};
  const { notify } = useNotification() ?? {};
  const [form, setForm] = useState({
    patientName: user?.name ?? '',
    phone: user?.phone ?? '',
    doctorId: selectedDoctorId,
    date: todayISO(),
    time: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    setForm((f) => ({ ...f, patientName: user?.name ?? '', phone: user?.phone ?? '' }));
  }, [user]);

  useEffect(() => {
    if (selectedDoctorId) setForm((f) => ({ ...f, doctorId: selectedDoctorId }));
  }, [selectedDoctorId]);

  function validate(values) {
    const errs = {};
    if (!values.patientName.trim()) errs.patientName = 'Please enter the patient name.';
    if (!values.phone.trim()) errs.phone = 'Please enter a phone number.';
    else if (!/^[\d\s()+-]{7,}$/.test(values.phone.trim())) errs.phone = 'Please enter a valid phone number.';
    if (!values.doctorId) errs.doctorId = 'Please choose a doctor.';
    if (!values.date) errs.date = 'Please choose a date.';
    else if (values.date < todayISO()) errs.date = 'The date cannot be in the past.';
    if (!values.time) errs.time = 'Please choose a time slot.';
    return errs;
  }

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => (errs[name] ? { ...errs, [name]: undefined } : errs));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).some((k) => errs[k])) return;

    setSubmitting(true);
    try {
      const doctor = doctors.find((d) => d.id === form.doctorId);
      const record = await bookAppointment({
        doctorId: form.doctorId,
        doctorName: doctor ? doctor.name : '',
        patientName: form.patientName.trim(),
        phone: form.phone.trim(),
        date: form.date,
        time: form.time,
      });
      if (onBooked) onBooked(record);
      notify(`Appointment confirmed with ${record.doctorName} on ${record.date} at ${record.time}.`);
      setForm((f) => ({ ...f, doctorId: '', time: '' }));
    } catch (err) {
      setApiError(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const state = (name) =>
    errors[name] ? { 'aria-invalid': true, 'aria-describedby': `ap-${name}-error` } : {};

  return (
    <form
      className="card form-card"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Appointment booking form"
    >
      <h2>Book an appointment</h2>

      {apiError && (
        <p className="banner banner-error" role="alert">
          {apiError}
        </p>
      )}

      <div className="form-row">
        <div className="field">
          <label htmlFor="ap-patientName">
            Name <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="ap-patientName"
            type="text"
            autoComplete="name"
            value={form.patientName}
            onChange={(e) => setField('patientName', e.target.value)}
            required
            {...state('patientName')}
          />
          {errors.patientName && (
            <p className="field-error" role="alert" id="ap-patientName-error">
              {errors.patientName}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="ap-phone">
            Phone Number <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="ap-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            required
            {...state('phone')}
          />
          {errors.phone && (
            <p className="field-error" role="alert" id="ap-phone-error">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="ap-doctor">
            Doctor <span className="req" aria-hidden="true">*</span>
          </label>
          <select
            id="ap-doctor"
            value={form.doctorId}
            onChange={(e) => setField('doctorId', e.target.value)}
            required
            {...state('doctorId')}
          >
            <option value="">Select a doctor…</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {doctor.specialty}
              </option>
            ))}
          </select>
          {errors.doctorId && (
            <p className="field-error" role="alert" id="ap-doctorId-error">
              {errors.doctorId}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="ap-date">
            Date <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="ap-date"
            type="date"
            min={todayISO()}
            value={form.date}
            onChange={(e) => setField('date', e.target.value)}
            required
            {...state('date')}
          />
          {errors.date && (
            <p className="field-error" role="alert" id="ap-date-error">
              {errors.date}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="ap-time">
          Time <span className="req" aria-hidden="true">*</span>
        </label>
        <select
          id="ap-time"
          value={form.time}
          onChange={(e) => setField('time', e.target.value)}
          required
          {...state('time')}
        >
          <option value="">Select a time…</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
        {errors.time && (
          <p className="field-error" role="alert" id="ap-time-error">
            {errors.time}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-big btn-block" disabled={submitting}>
        {submitting ? 'Booking…' : 'Confirm appointment'}
      </button>
    </form>
  );
}
