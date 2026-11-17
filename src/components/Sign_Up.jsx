import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { isEmail } from '../utils/validate.js';

/**
 * Sign Up component — invokes the registration API (POST /api/register,
 * see server/index.js) to register a new user, then signs them in.
 */
export default function Sign_Up() {
  const { login: setSignedInUser } = useAuth() ?? {};
  const { notify } = useNotification() ?? {};
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: 'patient', name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(values) {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Please enter your full name.';
    if (!values.email.trim()) errs.email = 'Please enter your email address.';
    else if (!isEmail(values.email)) errs.email = 'Please enter a valid email address.';
    if (!values.phone.trim()) errs.phone = 'Please enter your phone number.';
    else if (!/^[\d\s()+-]{7,}$/.test(values.phone.trim())) errs.phone = 'Please enter a valid phone number.';
    if (!values.password) errs.password = 'Please choose a password.';
    else if (values.password.length < 8) errs.password = 'Password must be at least 8 characters long.';
    else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
      errs.password = 'Password must contain at least one letter and one number.';
    }
    if (values.confirm !== values.password) errs.confirm = 'Passwords do not match.';
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
      // Registration API call — creates the new user account.
      const user = await registerUser({
        role: form.role,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setSignedInUser(user);
      notify('Account created. Welcome to StayHealthy!');
      navigate('/');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const field = (key) => (errors[key] ? { 'aria-invalid': true, 'aria-describedby': `su-${key}-error` } : {});

  return (
    <section className="auth-section">
      <div className="container auth-wrap">
        <form className="card form-card auth-card" onSubmit={handleSubmit} noValidate aria-label="Sign up form">
          <h1>Create your account</h1>
          <p className="auth-sub">Join StayHealthy and book a doctor in under a minute.</p>

          {apiError && (
            <p className="banner banner-error" role="alert">
              {apiError}
            </p>
          )}

          <div className="field">
            <label htmlFor="su-role">Role</label>
            <select id="su-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="su-name">Full name</label>
            <input
              id="su-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              {...field('name')}
            />
            {errors.name && (
              <p className="field-error" role="alert" id="su-name-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="su-email">Email</label>
            <input
              id="su-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              {...field('email')}
            />
            {errors.email && (
              <p className="field-error" role="alert" id="su-email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="su-phone">Phone number</label>
            <input
              id="su-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              {...field('phone')}
            />
            {errors.phone && (
              <p className="field-error" role="alert" id="su-phone-error">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="su-password">Password</label>
            <input
              id="su-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              {...field('password')}
            />
            {errors.password && (
              <p className="field-error" role="alert" id="su-password-error">
                {errors.password}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="su-confirm">Confirm password</label>
            <input
              id="su-confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              {...field('confirm')}
            />
            {errors.confirm && (
              <p className="field-error" role="alert" id="su-confirm-error">
                {errors.confirm}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign Up'}
          </button>

          <p className="form-hint">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
