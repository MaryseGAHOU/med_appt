import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container center">
        <p className="eyebrow">Error 404</p>
        <h1>We couldn't find that page</h1>
        <p className="section-sub">The page you are looking for may have moved or no longer exists.</p>
        <Link to="/" className="btn">Back to home</Link>
      </div>
    </section>
  );
}
