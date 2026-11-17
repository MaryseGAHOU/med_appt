import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { isEmail } from '../utils/validate.js';

/**
 * Login component — invokes the authentication API (POST /api/login,
 * see server/index.js) to authenticate the user, then stores the session.
 */
export default function Login() {
  const { login: setSignedInUser } = useAuth() ?? {};
  const { notify } = useNotification() ?? {};
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(values) {
    const errs = {};
    if (!values.email.trim()) errs.email = 'Please enter your email address.';
    else if (!isEmail(values.email)) errs.email = 'Please enter a valid email address.';
    if (!values.password) errs.password = 'Please enter your password.';
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
      // Authentication API call — validates the credentials.
      const user = await login(form);
      setSignedInUser(user);
      notify(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-section">
      <div className="container auth-wrap">
        <form className="card form-card auth-card" onSubmit={handleSubmit} noValidate aria-label="Login form">
          <h1>Login</h1>
          <p className="auth-sub">Sign in to manage your appointments.</p>

          {apiError && (
            <p className="banner banner-error" role="alert">
              {apiError}
            </p>
          )}

          <div className="field">
            <label htmlFor="lg-email">Email</label>
            <input
              id="lg-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'lg-email-error' : undefined}
            />
            {errors.email && (
              <p className="field-error" role="alert" id="lg-email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="lg-password">Password</label>
            <input
              id="lg-password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? 'lg-password-error' : undefined}
            />
            {errors.password && (
              <p className="field-error" role="alert" id="lg-password-error">
                {errors.password}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-block" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </button>

          <p className="form-hint">
            New here? <Link to="/signup">Sign Up</Link>
          </p>
          <p className="demo-hint">
            Demo account — email: <code>demo@example.com</code> · password: <code>Demo1234</code>
          </p>
        </form>
      </div>
    </section>
  );
}
