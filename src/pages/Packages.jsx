import { Link } from "react-router-dom";
import { packages } from "../data/packages";
import "./Packages.css";

export default function Packages() {
  return (
    <section className="pk">
      <h1 className="pk__title"><span>Compare</span> <strong>Packages</strong></h1>

      <div className="pk__scroll">
        <table className="pk__table">
          <thead>
            <tr>
              <th />
              {packages.map((p) => <th key={p.id}>{p.title.join(" ")}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr><td>Location</td>{packages.map((p) => <td key={p.id}>{p.features[0]}</td>)}</tr>
            <tr><td>Session</td>{packages.map((p) => <td key={p.id}>{p.features[1]}</td>)}</tr>
            <tr><td>Edited images</td>{packages.map((p) => <td key={p.id}>{p.features[2]}</td>)}</tr>
            <tr><td>Online gallery</td>{packages.map((p) => <td key={p.id}>Included</td>)}</tr>
            <tr><td>Print release</td>{packages.map((p) => <td key={p.id}>Included</td>)}</tr>
            <tr className="pk__price"><td>Price</td>{packages.map((p) => <td key={p.id}>${p.price}</td>)}</tr>
            <tr>
              <td />
              {packages.map((p) => (
                <td key={p.id}>
                  <Link className="btn-dark" to={`/booking?package=${p.id}`}>Book</Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}