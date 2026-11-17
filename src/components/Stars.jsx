export default function Stars({ value = 5 }) {
  const full = '★★★★★'.slice(0, value);
  const empty = '☆☆☆☆☆'.slice(0, Math.max(0, 5 - value));
  return (
    <span className="stars" role="img" aria-label={`Rated ${value} out of 5 stars`}>
      <span aria-hidden="true" className="stars-full">{full}</span>
      <span aria-hidden="true" className="stars-empty">{empty}</span>
    </span>
  );
}
