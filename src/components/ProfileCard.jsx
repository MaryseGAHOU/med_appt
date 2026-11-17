import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';

/**
 * ProfileCard — profile card UI with the edit form (Task 12).
 * Shows the signed-in user's details and lets them update name, phone and role.
 */
export default function ProfileCard() {
  const { user, update } = useAuth() ?? {};
  const { notify } = useNotification() ?? {};
  const [form, setForm] = useState({ name: '', phone: '', role: 'patient' });
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name ?? '', phone: user.phone ?? '', role: user.role ?? 'patient' });
    }
  }, [user]);

  if (!user) {
    return (
      <section className="section">
        <div className="container center">
          <h1>My profile</h1>
          <p className="section-sub">Log in to view and edit your profile.</p>
          <Link to="/login" className="btn">Go to login</Link>
        </div>
      </section>
    );
  }

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function validate(values) {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Please enter your full name.';
    if (!values.phone.trim()) errs.phone = 'Please enter your phone number.';
    else if (!/^[\d\s()+-]{7,}$/.test(values.phone.trim())) errs.phone = 'Please enter a valid phone number.';
    return errs;
  }

  async function handleSave(e) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).some((k) => errs[k])) return;

    setSaving(true);
    try {
      const updated = await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        role: form.role,
      });
      update(updated);
      setEditing(false);
      notify('Profile updated successfully.');
    } catch (err) {
      notify(err.message || 'Update failed. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="section">
      <div className="container profile-layout">
        <div className="card profile-card">
          <span className="profile-avatar" aria-hidden="true">{initials}</span>
          <h1>{user.name}</h1>
          <p className="muted">{user.email}</p>
          <ul className="profile-details">
            <li><span>Role</span><strong>{user.role}</strong></li>
            <li><span>Phone</span><strong>{user.phone || '—'}</strong></li>
          </ul>
          <button type="button" className="btn btn-outline-dark" onClick={() => setEditing((e) => !e)}>
            {editing ? 'Close editor' : 'Edit profile'}
          </button>
        </div>

        {editing && (
          <form className="card form-card" onSubmit={handleSave} noValidate aria-label="Edit profile form">
            <h2>Edit your details</h2>

            <div className="field">
              <label htmlFor="pf-name">Full name</label>
              <input
                id="pf-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'pf-name-error' : undefined}
              />
              {errors.name && (
                <p className="field-error" role="alert" id="pf-name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="pf-phone">Phone number</label>
              <input
                id="pf-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? 'pf-phone-error' : undefined}
              />
              {errors.phone && (
                <p className="field-error" role="alert" id="pf-phone-error">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="pf-role">Role</label>
              <select id="pf-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <button type="submit" className="btn btn-block" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
