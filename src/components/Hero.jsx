import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <p className="hero__brand">LUXE FRAME</p>
      <h1 className="hero__title">
        <span className="hero__light">Photography</span>
        <span className="hero__bold">Packages</span>
      </h1>
      <p className="hero__cats">EVENTS / FASHION / CREATIVITY / WEDDINGS</p>
    </section>
  );
}