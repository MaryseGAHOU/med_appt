// StayHealthy REST API — registration, login, doctors, appointments and reviews.
// The React app calls these endpoints (Sign_Up.jsx, Login.jsx, etc.).
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'db.json');
const PORT = process.env.PORT || 5000;

const SEED = {
  users: [],
  doctors: [
    { id: 'd1', name: 'Dr. Sarah Mitchell', specialty: 'General Physician', experience: 12, rating: 4.8, fee: 40 },
    { id: 'd2', name: 'Dr. James Carter', specialty: 'Cardiologist', experience: 15, rating: 4.9, fee: 60 },
    { id: 'd3', name: 'Dr. Priya Sharma', specialty: 'Dermatologist', experience: 9, rating: 4.7, fee: 45 },
    { id: 'd4', name: 'Dr. Emmanuel Okafor', specialty: 'Pediatrician', experience: 11, rating: 4.8, fee: 40 },
    { id: 'd5', name: 'Dr. Laura Bennett', specialty: 'Dentist', experience: 8, rating: 4.6, fee: 50 },
    { id: 'd6', name: 'Dr. Kenji Tanaka', specialty: 'Nutritionist', experience: 7, rating: 4.5, fee: 35 },
  ],
  appointments: [],
  reviews: [
    { id: 'r1', name: 'Amelia R.', rating: 5, comment: 'Booked a general physician in under a minute. The consultation was thorough and caring.', date: '2026-10-02' },
    { id: 'r2', name: 'Jordan P.', rating: 5, comment: 'StayHealthy saved me a two-hour trip. The doctor called me right on time.', date: '2026-10-11' },
    { id: 'r3', name: 'Marta S.', rating: 4, comment: 'Great platform. I just wish more pediatricians were available on weekends.', date: '2026-10-18' },
  ],
};

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return JSON.parse(JSON.stringify(SEED));
  }
}

function saveDb(db) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

const uid = () => Math.random().toString(36).slice(2, 10);

const app = express();
app.use(express.json());

// Simple CORS so the React dev server (or any deployed front end) can call the API.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

/* ---------- Authentication ---------- */

app.post('/api/register', (req, res) => {
  const db = loadDb();
  const { role, name, email, phone, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }
  const emailNorm = String(email).trim().toLowerCase();
  if (db.users.some((u) => u.email === emailNorm)) {
    return res.status(409).json({ message: 'An account with this email already exists. Please log in instead.' });
  }
  const user = {
    id: 'u' + uid(),
    role: role || 'patient',
    name: String(name).trim(),
    email: emailNorm,
    phone: phone || '',
    password,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDb(db);
  res.status(201).json({
    message: 'Registration successful. You can now log in.',
    user: { id: user.id, role: user.role, name: user.name, email: user.email, phone: user.phone },
  });
});

app.post('/api/login', (req, res) => {
  const db = loadDb();
  const { email, password } = req.body || {};
  const user = db.users.find(
    (u) => u.email === String(email || '').trim().toLowerCase() && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password. Please try again.' });
  }
  res.json({
    message: 'Login successful.',
    token: 'demo-' + uid(),
    user: { id: user.id, role: user.role, name: user.name, email: user.email, phone: user.phone },
  });
});

/* ---------- Doctors ---------- */

app.get('/api/doctors', (req, res) => res.json(loadDb().doctors));

/* ---------- Appointments ---------- */

app.get('/api/appointments', (req, res) => res.json(loadDb().appointments));

app.post('/api/appointments', (req, res) => {
  const db = loadDb();
  const appointment = { id: 'a' + uid(), ...req.body, createdAt: new Date().toISOString() };
  db.appointments.push(appointment);
  saveDb(db);
  res.status(201).json(appointment);
});

app.delete('/api/appointments/:id', (req, res) => {
  const db = loadDb();
  const before = db.appointments.length;
  db.appointments = db.appointments.filter((a) => a.id !== req.params.id);
  if (db.appointments.length === before) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }
  saveDb(db);
  res.json({ message: 'Appointment cancelled successfully.' });
});

/* ---------- Reviews ---------- */

app.get('/api/reviews', (req, res) => res.json(loadDb().reviews));

app.post('/api/reviews', (req, res) => {
  const db = loadDb();
  const review = { id: 'r' + uid(), ...req.body, date: new Date().toISOString().slice(0, 10) };
  db.reviews.unshift(review);
  saveDb(db);
  res.status(201).json(review);
});

app.listen(PORT, () => {
  console.log(`StayHealthy API running on http://localhost:${PORT}`);
});
