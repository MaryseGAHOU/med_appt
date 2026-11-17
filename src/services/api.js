import { db } from './db.js';

/**
 * Data layer for StayHealthy.
 *
 * Every function first tries the real REST API (server/index.js — the API
 * invoked by Sign_Up.jsx and Login.jsx). If the API is unreachable (e.g. the
 * static site is deployed without a backend), the same operation transparently
 * falls back to the local persistent database (services/db.js), so the app
 * always works.
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

async function tryApi(path, options) {
  try {
    const res = await fetch(API_BASE + path, options);
    if (!res.ok) {
      let message = `Request failed (${res.status}).`;
      try {
        const err = await res.json();
        if (err && err.message) message = err.message;
      } catch {
        /* response was not JSON */
      }
      throw Object.assign(new Error(message), { handled: true });
    }
    return res.json();
  } catch (e) {
    if (e && e.handled) throw e;
    // Network/URL failure → caller falls back to the local database.
    throw Object.assign(new Error('API_UNREACHABLE'), { handled: true, offline: true });
  }
}

/* ---------- Authentication (invoked by Sign_Up.jsx and Login.jsx) ---------- */

export async function registerUser({ role, name, email, phone, password }) {
  try {
    const data = await tryApi('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, name, email, phone, password }),
    });
    db.setSession({ userId: data.user.id, name: data.user.name, email: data.user.email, phone: data.user.phone, role: data.user.role });
    return data.user;
  } catch (e) {
    if (!e.offline) throw e;
    return registerLocal({ role, name, email, phone, password });
  }
}

async function registerLocal({ role, name, email, phone, password }) {
  await delay();
  const users = db.getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error('An account with this email already exists. Please log in instead.');
  }
  const user = {
    id: 'u' + uid(),
    role: role || 'patient',
    name: name.trim(),
    email: normalizedEmail,
    phone: phone || '',
    password, // NOTE: demo project only — never store plain-text passwords in production.
    createdAt: new Date().toISOString(),
  };
  db.saveUsers([...users, user]);
  db.setSession({ userId: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
  return { id: user.id, role: user.role, name: user.name, email: user.email, phone: user.phone };
}

export async function login({ email, password }) {
  try {
    const data = await tryApi('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    db.setSession({ userId: data.user.id, name: data.user.name, email: data.user.email, phone: data.user.phone, role: data.user.role });
    return data.user;
  } catch (e) {
    if (!e.offline) throw e;
    return loginLocal({ email, password });
  }
}

async function loginLocal({ email, password }) {
  await delay();
  const users = db.getUsers();
  const user = users.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password
  );
  if (!user) throw new Error('Invalid email or password. Please try again.');
  db.setSession({ userId: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
  return { id: user.id, role: user.role, name: user.name, email: user.email, phone: user.phone };
}

export function logout() {
  db.clearSession();
}

export function getSession() {
  return db.getSession();
}

export async function updateProfile(updated) {
  // Profile editing updates the local persistent store (and the live session).
  await delay(200);
  const users = db.getUsers();
  const session = db.getSession();
  if (!session) throw new Error('You must be logged in to update your profile.');
  const index = users.findIndex((u) => u.id === session.userId);
  if (index !== -1) {
    users[index] = { ...users[index], name: updated.name, phone: updated.phone, role: updated.role };
    db.saveUsers(users);
  }
  const nextSession = { ...session, name: updated.name, phone: updated.phone, role: updated.role };
  db.setSession(nextSession);
  return { id: session.userId, name: updated.name, email: session.email, phone: updated.phone, role: updated.role };
}

/* ---------- Doctors ---------- */

export async function fetchDoctors() {
  try {
    return await tryApi('/api/doctors');
  } catch (e) {
    if (!e.offline) throw e;
    await delay(250);
    return db.getDoctors();
  }
}

/* ---------- Appointments ---------- */

export async function bookAppointment(payload) {
  try {
    return await tryApi('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    if (!e.offline) throw e;
    await delay(500);
    const record = { id: 'a' + uid(), ...payload, createdAt: new Date().toISOString() };
    db.saveAppointments([...db.getAppointments(), record]);
    return record;
  }
}

export async function fetchAppointments() {
  try {
    return await tryApi('/api/appointments');
  } catch (e) {
    if (!e.offline) throw e;
    await delay(250);
    return db.getAppointments();
  }
}

export async function cancelAppointment(id) {
  try {
    const data = await tryApi(`/api/appointments/${id}`, { method: 'DELETE' });
    return data;
  } catch (e) {
    if (!e.offline) throw e;
    await delay(300);
    const before = db.getAppointments().length;
    db.saveAppointments(db.getAppointments().filter((a) => a.id !== id));
    if (db.getAppointments().length === before) {
      throw new Error('Appointment not found.');
    }
    return { message: 'Appointment cancelled successfully.' };
  }
}

/* ---------- Reviews ---------- */

export async function fetchReviews() {
  try {
    return await tryApi('/api/reviews');
  } catch (e) {
    if (!e.offline) throw e;
    await delay(250);
    return db.getReviews();
  }
}

export async function addReview(review) {
  try {
    return await tryApi('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
  } catch (e) {
    if (!e.offline) throw e;
    await delay(400);
    const record = { id: 'r' + uid(), ...review, rating: Number(review.rating), date: new Date().toISOString().slice(0, 10) };
    db.saveReviews([record, ...db.getReviews()]);
    return record;
  }
}
