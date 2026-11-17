import { Link } from 'react-router-dom';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.2c0-.8.3-1.4 1.5-1.4h1.4V5.2c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.2H8v2.9h2.5v7h3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.7 3H21l-7.1 8.1L22.2 21h-6.6l-5.1-6.2L4.6 21H1.3l7.6-8.7L1.8 3h6.7l4.6 5.6L17.7 3zm-1.2 16h1.8L7.4 4.9H5.5L16.5 19z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">
            Stay<em>Healthy</em>
          </p>
          <p className="footer-blurb">
            A nonprofit platform connecting patients with trusted doctors — anytime, anywhere.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h3>Quick links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/appointments">Book an appointment</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/signup">Create an account</Link></li>
          </ul>
        </nav>

        <div>
          <h3>Contact</h3>
          <address>
            <span>123 Health Avenue, Chicago, IL 60607</span>
            <a href="tel:+13125550100">(312) 555-0100</a>
            <a href="mailto:support@stayhealthy.example">support@stayhealthy.example</a>
          </address>
        </div>

        <div>
          <h3>Support hours</h3>
          <ul className="hours-list">
            <li><span>Mon – Fri</span><span>8:00 – 20:00</span></li>
            <li><span>Saturday</span><span>9:00 – 17:00</span></li>
            <li><span>Sunday</span><span>Emergency line only</span></li>
          </ul>
          <div className="social">
            <a href="https://instagram.com" aria-label="StayHealthy on Instagram" target="_blank" rel="noreferrer">
              <InstagramIcon />
            </a>
            <a href="https://facebook.com" aria-label="StayHealthy on Facebook" target="_blank" rel="noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://x.com" aria-label="StayHealthy on X" target="_blank" rel="noreferrer">
              <XIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} StayHealthy. All rights reserved.</p>
      </div>
    </footer>
  );
}
