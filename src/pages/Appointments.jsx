import { useEffect, useState } from 'react';
import FindDoctorSearch from '../components/FindDoctorSearch.jsx';
import DoctorCard from '../components/DoctorCard.jsx';
import AppointmentForm from '../components/AppointmentForm.jsx';
import AppointmentFormIC from '../components/AppointmentFormIC.jsx';
import { fetchDoctors, fetchAppointments } from '../services/api.js';

export default function Appointments() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(true);

  const specialties = [...new Set(doctors.map((d) => d.specialty))];

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

  function handleBooked(record) {
    setAppointments((list) => [...list, record]);
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
          <FindDoctorSearch specialties={specialties} />

          {loading ? (
            <p className="muted">Loading doctors…</p>
          ) : (
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  appointment={appointments.find((a) => a.doctorId === doctor.id)}
                  setAppointments={setAppointments}
                  onBook={() => setSelectedDoctorId(doctor.id)}
                />
              ))}
              {doctors.length === 0 && (
                <p className="muted">No doctors available right now.</p>
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
