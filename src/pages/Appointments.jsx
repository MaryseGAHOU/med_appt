import { useEffect, useMemo, useState } from 'react';
import FindDoctorSearch from '../components/FindDoctorSearch.jsx';
import DoctorCard from '../components/DoctorCard.jsx';
import AppointmentForm from '../components/AppointmentForm.jsx';
import AppointmentFormIC from '../components/AppointmentFormIC.jsx';
import {
  fetchDoctors,
  fetchAppointments,
  cancelAppointment,
} from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';

export default function Appointments() {
  const { notify } = useNotification() ?? {};
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ query: '', specialty: 'All' });
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(true);

  const specialties = useMemo(
    () => [...new Set(doctors.map((d) => d.specialty))],
    [doctors]
  );

  useEffect(() => {
    let active = true;
    Promise.all([fetchDoctors(), fetchAppointments()]).then(([docs, appts]) => {
      if (!active) return;
      setDoctors(docs);
      setAppointments(appts);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = doctors.filter(
    (d) =>
      (filters.specialty === 'All' || d.specialty === filters.specialty) &&
      d.name.toLowerCase().includes(filters.query.trim().toLowerCase())
  );

  function handleBooked(record) {
    setAppointments((list) => [...list, record]);
  }

  async function handleCancel(appointment) {
    try {
      await cancelAppointment(appointment.id);
      setAppointments((list) => list.filter((a) => a.id !== appointment.id));
      notify('Appointment cancelled successfully.');
    } catch (err) {
      notify(err.message || 'Cancellation failed.', 'error');
    }
  }

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Find a doctor</h1>
          <p className="section-sub">
            Search by name or specialty, then book your appointment in seconds.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FindDoctorSearch filters={filters} onFilterChange={setFilters} specialties={specialties} />

          {loading ? (
            <p className="muted">Loading doctors…</p>
          ) : (
            <div className="doctors-grid">
              {filtered.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  appointment={appointments.find((a) => a.doctorId === doctor.id)}
                  onBook={() => setSelectedDoctorId(doctor.id)}
                  onCancel={handleCancel}
                />
              ))}
              {filtered.length === 0 && (
                <p className="muted">No doctors match your search. Try different keywords.</p>
              )}
            </div>
          )}

          <div className="booking-forms">
            <AppointmentForm
              doctors={doctors}
              selectedDoctorId={selectedDoctorId}
              onBooked={handleBooked}
            />
            <AppointmentFormIC />
          </div>
        </div>
      </section>
    </>
  );
}
