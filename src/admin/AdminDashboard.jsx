import { useCallback, useEffect, useMemo, useState } from "react";
import { packages } from "../data/packages";
import { adminGetBookings, adminUpdateBooking, adminDeleteBooking } from "../api";
import { useAuth } from "./AuthContext";

const STATUSES = ["new", "confirmed", "completed", "cancelled"];
const pkgById = Object.fromEntries(packages.map((p) => [p.id, p]));
const fmt = (iso) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null); // id of the row whose message is expanded

  const handleError = useCallback(
    (err) => (err.status === 401 ? logout() : setError(err.message)),
    [logout]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setBookings(await adminGetBookings(token));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status) => {
    try {
      const updated = await adminUpdateBooking(token, id, status);
      setBookings((list) => list.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      handleError(err);
    }
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete the booking from ${b.name}? This can't be undone.`)) return;
    try {
      await adminDeleteBooking(token, b.id);
      setBookings((list) => list.filter((x) => x.id !== b.id));
    } catch (err) {
      handleError(err);
    }
  };

  const stats = useMemo(() => {
    const count = (s) => bookings.filter((b) => b.status === s).length;
    const revenue = bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (pkgById[b.package]?.price ?? 0), 0);
    return { total: bookings.length, new: count("new"), confirmed: count("confirmed"), revenue };
  }, [bookings]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter(
      (b) =>
        (filter === "all" || b.status === filter) &&
        (!q || [b.name, b.email, b.phone, b.type].some((f) => f?.toLowerCase().includes(q)))
    );
  }, [bookings, filter, query]);

  return (
    <div className="adm">
      <header className="adm__bar">
        <div>
          <p className="adm-brand">LUXE FRAME</p>
          <h1>Bookings <strong>Admin</strong></h1>
        </div>
        <div className="adm__actions">
          <button className="adm-ghost" onClick={load}>Refresh</button>
          <button className="adm-ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="adm__stats">
        <div><span>Total</span><strong>{stats.total}</strong></div>
        <div><span>New</span><strong>{stats.new}</strong></div>
        <div><span>Confirmed</span><strong>{stats.confirmed}</strong></div>
        <div><span>Booked value</span><strong>${stats.revenue}</strong></div>
      </section>

      <div className="adm__tools">
        <div className="adm__tabs" role="group" aria-label="Filter by status">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              className={s === filter ? "is-active" : ""}
              aria-pressed={s === filter}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="search" placeholder="Search name, email, type…" aria-label="Search bookings"
          value={query} onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="adm-error" role="alert">{error}</p>}
      {loading && <p className="adm__empty">Loading…</p>}
      {!loading && visible.length === 0 && <p className="adm__empty">No bookings found.</p>}

      {visible.length > 0 && (
        <div className="adm__scroll">
          <table className="adm__table">
            <thead>
              <tr>
                <th>Client</th><th>Package</th><th>Type</th><th>Shoot date</th>
                <th>Received</th><th>Status</th><th />
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <>
                  <tr key={b.id}>
                    <td>
                      <strong>{b.name}</strong>
                      <br /><a href={`mailto:${b.email}`}>{b.email}</a>
                      {b.phone && <><br /><a href={`tel:${b.phone}`}>{b.phone}</a></>}
                    </td>
                    <td>{pkgById[b.package]?.title.join(" ") ?? b.package}<br />${pkgById[b.package]?.price}</td>
                    <td className="cap">{b.type}</td>
                    <td>{fmt(b.date)}</td>
                    <td>{fmt(b.createdAt)}</td>
                    <td>
                      <select
                        className={`st st--${b.status}`} value={b.status}
                        aria-label={`Status for ${b.name}`}
                        onChange={(e) => changeStatus(b.id, e.target.value)}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="adm__row-actions">
                      {b.message && (
                        <button className="adm-ghost" onClick={() => setOpen(open === b.id ? null : b.id)}>
                          {open === b.id ? "Hide" : "Note"}
                        </button>
                      )}
                      <button className="adm-ghost adm-danger" onClick={() => remove(b)}>Delete</button>
                    </td>
                  </tr>
                  {open === b.id && (
                    <tr key={`${b.id}-msg`} className="adm__msg"><td colSpan="7">{b.message}</td></tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}