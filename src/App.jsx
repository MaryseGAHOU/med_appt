import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Notification from './components/Notification.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Home from './pages/Home.jsx';
import Appointments from './pages/Appointments.jsx';
import Reviews from './pages/Reviews.jsx';
import Results from './pages/Results.jsx';
import Sign_Up from './components/Sign_Up.jsx';
import Login from './components/Login.jsx';
import ProfileCard from './components/ProfileCard.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <NotificationProvider>
      <div className="app-shell">
        <a
          className="skip-link"
          href="#main-content"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('main-content')?.focus();
          }}
        >
          Skip to main content
        </a>

        <Navbar />

        {/* Notification component mounted at the app level — visible from every page */}
        <Notification />

        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/results" element={<Results />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Sign_Up />} />
            <Route path="/profile" element={<ProfileCard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </NotificationProvider>
  );
}
