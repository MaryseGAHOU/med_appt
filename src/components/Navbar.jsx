import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/appointments', label: 'Book Appointment' },
  { to: '/reviews', label: 'Reviews' },
];

export default function Navbar() {
  const { user, logout } = useAuth() ?? {};
  const { notify } = useNotification() ?? {};
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  // Logout functionality: clears the session and notifies the user app-wide.
  function handleLogout() {
    logout();
    notify('You have been logged out. See you soon!');
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="StayHealthy — home" onClick={closeMenu}>
          <svg width="38" height="38" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <rect width="64" height="64" rx="14" fill="#1F6E8C" />
            <path d="M27 14h10v13h13v10H37v13H27V37H14V27h13z" fill="#FAFDFC" />
          </svg>
          <span className="brand-text">
            Stay<em>Healthy</em>
          </span>
        </Link>

        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          <ul onClick={closeMenu}>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {user && (
              <li>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : undefined)} onClick={closeMenu}>
                  My profile
                </NavLink>
              </li>
            )}
          </ul>
          <div className="nav-auth">
            {user ? (
              <>
                <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
                <button type="button" className="btn btn-small btn-outline-dark" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-login" onClick={closeMenu}>
                  Login
                </NavLink>
                <Link to="/signup" className="btn btn-small" onClick={closeMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
