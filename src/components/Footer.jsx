import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="container" style={{ padding: "3rem var(--page-pad)", fontSize: "0.75rem", display: "grid", gap: "1rem" }}>
      <p>EVENTS / FASHION / CREATIVITY / WEDDINGS</p>
      <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <Link to="/packages">Packages</Link>
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/booking">Book now</Link>
      </nav>
      <p>© {new Date().getFullYear()} Luxe Frame</p>
    </footer>
  );
}