import { useEffect, useState } from 'react';
import { bookAppointment } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

/**
 * AppointmentFormIC — Instant Consultation form (Task 10).
 * Intentionally includes ONLY the Name and Phone Number fields:
 * the patient describes their situation live, with a doctor, on the phone.
 */
export default function AppointmentFormIC() {
  const { user } = useAuth() ?? {};
  const { notify } = useNotification() ?? {};
  const [form, setForm] = useState({ patientName: user?.name ?? '', phone: user?.phone ?? '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    setForm((f) => ({ ...f, patientName: user?.name ?? '', phone: user?.phone ?? '' }));
  }, [user]);

  function validate(values) {
    const errs = {};
    if (!values.patientName.trim()) errs.patientName = 'Please enter your name.';
    if (!values.phone.trim()) errs.phone = 'Please enter your phone number.';
    else if (!/^[\d\s()+-]{7,}$/.test(values.phone.trim())) errs.phone = 'Please enter a valid phone number.';
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
      const record = await bookAppointment({
        patientName: form.patientName.trim(),
        phone: form.phone.trim(),
        type: 'instant-consultation',
      });
      setConfirmed(record);
      notify('Instant consultation request received. A doctor will call you shortly.');
    } catch (err) {
      setApiError(err.message || 'Request failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="card form-card ic-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Instant consultation request"
    >
      <h2>Instant consultation</h2>
      <p className="muted">Can't wait for an appointment? Request an immediate callback from an available doctor.</p>

      {apiError && (
        <p className="banner banner-error" role="alert">
          {apiError}
        </p>
      )}

      {confirmed ? (
        <div className="banner banner-success" role="status">
          Request <strong>{confirmed.id}</strong> received! A doctor will contact you shortly.
          <button type="button" className="btn btn-small btn-outline-dark banner-action" onClick={() => setConfirmed(null)}>
            New request
          </button>
        </div>
      ) : (
        <>
          <div className="field">
            <label htmlFor="ic-name">
              Name <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id="ic-name"
              type="text"
              autoComplete="name"
              value={form.patientName}
              onChange={(e) => {
                setForm({ ...form, patientName: e.target.value });
                setErrors((errs) => ({ ...errs, patientName: undefined }));
              }}
              required
              aria-invalid={errors.patientName ? true : undefined}
              aria-describedby={errors.patientName ? 'ic-name-error' : undefined}
            />
            {errors.patientName && (
              <p className="field-error" role="alert" id="ic-name-error">
                {errors.patientName}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="ic-phone">
              Phone Number <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id="ic-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                setErrors((errs) => ({ ...errs, phone: undefined }));
              }}
              required
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? 'ic-phone-error' : undefined}
            />
            {errors.phone && (
              <p className="field-error" role="alert" id="ic-phone-error">
                {errors.phone}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-block" disabled={submitting}>
            {submitting ? 'Sending…' : 'Request instant consultation'}
          </button>
        </>
      )}
    </form>
  );
}
