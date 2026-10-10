import { Link } from "react-router-dom";
import "./PackageCard.css";

export default function PackageCard({ pkg, className = "" }) {
  const { id, title, features, price } = pkg;

  return (
    <Link
      to={`/booking?package=${id}`}
      className={`pkg ${className}`}
      aria-label={`${title.join(" ")}, $${price}. Book this package`}
    >
      <h3 className="pkg__title">
        {title.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h3>

      <div className="pkg__details">
        <ul className="pkg__features">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="pkg__price">${price}</p>
      </div>
    </Link>
  );
}