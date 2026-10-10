import Hero from "../components/Hero";
import PackageCard from "../components/PackageCard";
import PhotoBlob from "../components/PhotoBlob";
import Reveal from "../components/Reveal";
import { packages } from "../data/packages";
import "./Home.css";

const photos = {
  one:   { src: null, alt: "Runway model in a white gown" },
  two:   { src: null, alt: "Dancer mid-kick against a wall" },
  three: { src: null, alt: "Model seated on a white block" },
};

export default function Home() {
  return (
    <>
      <Hero />

      <section className="stagger" aria-label="Photography packages">
        {packages.map((pkg, i) => (
          <Reveal key={pkg.id}>
            <div className={`stagger__row stagger__row--${i % 2 === 0 ? "left" : "right"}`}>
              <PackageCard pkg={pkg} className="stagger__card" />
              <PhotoBlob {...photos[pkg.id]} className="stagger__photo" />
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}