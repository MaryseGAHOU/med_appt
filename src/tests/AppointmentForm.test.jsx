import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock the data layer so the test does not depend on the real API.
vi.mock('../services/api.js', () => ({
  bookAppointment: vi.fn().mockResolvedValue({
    id: 'a-test01',
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Mitchell',
    patientName: 'Jane Doe',
    phone: '+1 312 555 0101',
    date: '2026-12-01',
    time: '10:00',
  }),
}));

import AppointmentForm from '../components/AppointmentForm.jsx';
import { bookAppointment } from '../services/api.js';

const DOCTORS = [{ id: 'd1', name: 'Dr. Sarah Mitchell', specialty: 'General Physician' }];
const noop = () => {};

beforeEach(() => {
  bookAppointment.mockClear();
});

describe('AppointmentForm (Name, Phone Number, Date, Time)', () => {
  it('renders the four required fields with accessible labels', () => {
    render(<AppointmentForm doctors={DOCTORS} onBooked={noop} />);
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^time/i)).toBeInTheDocument();
  });

  it('blocks submission and shows errors when required fields are missing', () => {
    render(<AppointmentForm doctors={DOCTORS} onBooked={noop} />);
    fireEvent.click(screen.getByRole('button', { name: /confirm appointment/i }));

    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    expect(screen.getByText(/please enter the patient name/i)).toBeInTheDocument();
    expect(screen.getByText(/please choose a doctor/i)).toBeInTheDocument();
    expect(bookAppointment).not.toHaveBeenCalled();
  });

  it('calls onBooked after a valid submission', async () => {
    const onBooked = vi.fn();
    render(<AppointmentForm doctors={DOCTORS} onBooked={onBooked} />);

    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1 312 555 0101' } });
    fireEvent.change(screen.getByLabelText(/doctor/i), { target: { value: 'd1' } });
    // Date is pre-filled with today — only a time slot is missing.
    fireEvent.change(screen.getByLabelText(/^time/i), { target: { value: '10:00' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /confirm appointment/i }));
    });

    expect(bookAppointment).toHaveBeenCalledTimes(1);
    expect(onBooked).toHaveBeenCalledWith(expect.objectContaining({ id: 'a-test01' }));
  });
});
