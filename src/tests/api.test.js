import { describe, it, expect } from 'vitest';
import {
  registerUser,
  login,
  bookAppointment,
  cancelAppointment,
  addReview,
  fetchReviews,
} from '../services/api.js';

const uniqueEmail = () => `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.com`;

describe('data services (persistent database)', () => {
  it('registers a new user and signs in with the same credentials', async () => {
    const email = uniqueEmail();
    const user = await registerUser({
      role: 'patient',
      name: 'Test User',
      email,
      phone: '+1 312 555 0111',
      password: 'Password1',
    });
    expect(user.email).toBe(email);

    const signedIn = await login({ email, password: 'Password1' });
    expect(signedIn.email).toBe(email);
  });

  it('refuses to register the same email twice', async () => {
    const email = uniqueEmail();
    await registerUser({ role: 'patient', name: 'Test User', email, phone: '', password: 'Password1' });
    await expect(
      registerUser({ role: 'patient', name: 'Test User', email, phone: '', password: 'Password1' })
    ).rejects.toThrow(/already exists/i);
  });

  it('books an appointment and cancels it', async () => {
    const appointment = await bookAppointment({
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Mitchell',
      patientName: 'Test User',
      phone: '+1 312 555 0111',
      date: '2026-12-01',
      time: '10:00',
    });
    expect(appointment.id).toBeTruthy();

    const cancelled = await cancelAppointment(appointment.id);
    expect(cancelled.message).toMatch(/cancelled/i);
  });

  it('adds and lists reviews', async () => {
    const before = await fetchReviews();
    await addReview({ name: 'Reviewer', rating: 4, comment: 'Great platform, very fast booking.' });
    const after = await fetchReviews();
    expect(after.length).toBeGreaterThan(before.length);
  });
});
