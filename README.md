# med_appt 🩺

**med_appt** (Medical Appointment Booking) is the GitHub repository of **StayHealthy**, the front
end of a nonprofit health platform that connects patients with trusted doctors — anytime, anywhere.
It was built for the IBM *Front-End Development Capstone Project* (Coursera): patients can create
an account, search doctors by name or specialty, book an appointment, cancel it, request an instant
consultation and publish a review.

Live site: https://marysegahou.github.io/med_appt/

---

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 18 + Vite 5 |
| Routing | react-router-dom (HashRouter) |
| Styling | Hand-written CSS (`src/styles.css`) — responsive, accessible (WCAG-minded) |
| Tests | Vitest + React Testing Library (`npm test`) |
| API | Express (`server/index.js`) — register, login, doctors, appointments, reviews |

The app talks to the REST API first; if the API is unreachable (e.g. the static build deployed on
GitHub Pages), every operation transparently falls back to a persistent local database
(`src/services/db.js`) so the site always works.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the app in development (http://localhost:5173)
npm run dev

# 3. (Optional) Run the REST API (http://localhost:5000)
npm run server

# 4. Run the unit tests
npm test

# 5. Build the production bundle (output in server/build/)
npm run build

# 6. Preview the production build locally
npm run preview
```

### Project structure

```
med_appt/
├── index.html                  # SEO meta tags (title, description, keywords, OG)
├── server/
│   ├── index.js                # Express API: auth (register/login), doctors, appointments, reviews
│   └── build/                  # Production build created inside the server folder
├── src/
│   ├── main.jsx                # Entry point (HashRouter + AuthProvider + NotificationProvider)
│   ├── App.jsx                 # Routes + Navbar + Notification + Footer
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation with logout functionality
│   │   ├── Sign_Up.jsx         # Sign-up page invoking the registration API
│   │   ├── Login.jsx           # Login page invoking the authentication API
│   │   ├── FindDoctorSearch.jsx# Doctor search → navigates to the /results route by specialty
│   │   ├── DoctorCard.jsx      # Doctor card + appointment cancellation logic
│   │   ├── AppointmentForm.jsx # Booking form: Name, Phone Number, Date, Time
│   │   ├── AppointmentFormIC.jsx # Instant-consultation form: Name + Phone Number only
│   │   ├── GiveReviews.jsx     # Review form, disabled after submission
│   │   ├── ProfileCard.jsx     # Profile card with edit functionality
│   │   ├── Notification.jsx    # App-wide toast notifications
│   │   ├── Footer.jsx          # Site footer
│   │   └── Stars.jsx           # Rating stars helper
│   ├── pages/                  # Home, Appointments, Reviews, NotFound
│   ├── context/                # AuthContext, NotificationContext
│   ├── services/               # api.js (data layer), db.js (persistent local database)
│   └── tests/                  # Vitest unit tests
└── patient_report.PDF          # Patient report sample (medical info + prescription)
```

## Demo account

| Email | Password |
| --- | --- |
| `demo@example.com` | `Demo1234` |

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a new account and receive an `authtoken` |
| POST | `/api/auth/login` | Authenticate and receive an `authtoken` |
| GET | `/api/doctors` | List available doctors |
| GET/POST/DELETE | `/api/appointments` | List, book, cancel appointments |
| GET/POST | `/api/reviews` | List, publish patient reviews |

> **Note:** passwords are stored in plain text only because this is a course demonstration.
> A production system would hash them (bcrypt/argon2) and serve the API over HTTPS.
