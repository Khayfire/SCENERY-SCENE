import { useState } from "react";
import PhotoBlob from "../components/PhotoBlob";
import { portfolio, categories } from "../data/portfolio";
import "./Portfolio.css";

export default function Portfolio() {
  const [active, setActive] = useState("all");
  const items = active === "all" ? portfolio : portfolio.filter((i) => i.category === active);

  return (
    <section className="pf">
      <h1 className="pf__title"><span>Our</span> <strong>Work</strong></h1>

      <div className="pf__filters" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c}
            className={c === active ? "is-active" : ""}
            aria-pressed={c === active}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="pf__grid">
        {items.map((i) => <PhotoBlob key={i.id} src={i.src} alt={i.alt} />)}
      </div>
    </section>
  );
}