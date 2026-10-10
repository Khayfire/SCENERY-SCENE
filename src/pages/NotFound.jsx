
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="nf">
      <p className="nf__code">404</p>
      <h1><span>Page</span> <strong>not found</strong></h1>
      <p className="nf__text">The page you're looking for doesn't exist or has moved.</p>
      <div className="nf__actions">
        <Link to="/" className="btn-dark">Back home</Link>
        <Link to="/packages" className="nf__link">View packages</Link>
      </div>
    </section>
  );
}