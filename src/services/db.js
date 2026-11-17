// Tiny localStorage-backed database used as the persistent store of the app
// and as an offline fallback when the REST API is unreachable.
const KEYS = {
  USERS: 'stayhealthy_users',
  DOCTORS: 'stayhealthy_doctors',
  APPOINTMENTS: 'stayhealthy_appointments',
  REVIEWS: 'stayhealthy_reviews',
  SESSION: 'stayhealthy_session',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — the app keeps working, data just does not persist.
  }
}

const SEED_DOCTORS = [
  { id: 'd1', name: 'Dr. Sarah Mitchell', specialty: 'General Physician', experience: 12, rating: 4.8, fee: 40 },
  { id: 'd2', name: 'Dr. James Carter', specialty: 'Cardiologist', experience: 15, rating: 4.9, fee: 60 },
  { id: 'd3', name: 'Dr. Priya Sharma', specialty: 'Dermatologist', experience: 9, rating: 4.7, fee: 45 },
  { id: 'd4', name: 'Dr. Emmanuel Okafor', specialty: 'Pediatrician', experience: 11, rating: 4.8, fee: 40 },
  { id: 'd5', name: 'Dr. Laura Bennett', specialty: 'Dentist', experience: 8, rating: 4.6, fee: 50 },
  { id: 'd6', name: 'Dr. Kenji Tanaka', specialty: 'Nutritionist', experience: 7, rating: 4.5, fee: 35 },
];

const SEED_REVIEWS = [
  { id: 'r1', name: 'Amelia R.', rating: 5, comment: 'Booked a general physician in under a minute. The consultation was thorough and caring.', date: '2026-10-02' },
  { id: 'r2', name: 'Jordan P.', rating: 5, comment: 'StayHealthy saved me a two-hour trip. The doctor called me right on time.', date: '2026-10-11' },
  { id: 'r3', name: 'Marta S.', rating: 4, comment: 'Great platform. I just wish more pediatricians were available on weekends.', date: '2026-10-18' },
];

function seed() {
  if (read(KEYS.USERS, null) === null) {
    write(KEYS.USERS, [
      {
        id: 'demo-user',
        role: 'patient',
        name: 'Demo Patient',
        email: 'demo@example.com',
        phone: '+1 312 555 0100',
        password: 'Demo1234',
        createdAt: '2026-01-05T09:00:00.000Z',
      },
    ]);
  }
  if (read(KEYS.DOCTORS, null) === null) write(KEYS.DOCTORS, SEED_DOCTORS);
  if (read(KEYS.REVIEWS, null) === null) write(KEYS.REVIEWS, SEED_REVIEWS);
  if (read(KEYS.APPOINTMENTS, null) === null) write(KEYS.APPOINTMENTS, []);
}

seed();

export const db = {
  keys: KEYS,
  getUsers: () => read(KEYS.USERS, []),
  saveUsers: (users) => write(KEYS.USERS, users),
  getDoctors: () => read(KEYS.DOCTORS, SEED_DOCTORS),
  getAppointments: () => read(KEYS.APPOINTMENTS, []),
  saveAppointments: (list) => write(KEYS.APPOINTMENTS, list),
  getReviews: () => read(KEYS.REVIEWS, []),
  saveReviews: (reviews) => write(KEYS.REVIEWS, reviews),
  getSession: () => read(KEYS.SESSION, null),
  setSession: (session) => write(KEYS.SESSION, session),
  clearSession: () => {
    try {
      localStorage.removeItem(KEYS.SESSION);
    } catch {
      /* noop */
    }
  },
};
