import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { packages } from "../data/packages";
import { createBooking } from "../api";
import "./Booking.css";

const TYPES = ["events", "fashion", "creativity", "weddings"];
const today = new Date().toISOString().split("T")[0];

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (v.phone && !/^[+\d][\d\s()-]{6,19}$/.test(v.phone.trim())) e.phone = "Enter a valid phone number.";
  if (!v.package) e.package = "Choose a package.";
  if (!v.type) e.type = "Choose a shoot type.";
  if (!v.date) e.date = "Pick a preferred date.";
  else if (v.date < today) e.date = "Date can't be in the past.";
  if (v.message.length > 1000) e.message = "Keep it under 1000 characters.";
  return e;
}

export default function Booking() {
  const [params] = useSearchParams();
  const initialPkg = packages.some((p) => p.id === params.get("package")) ? params.get("package") : "";

  const [values, setValues] = useState({
    name: "", email: "", phone: "", package: initialPkg,
    type: "", date: "", message: "", website: "", // "website" is a hidden honeypot
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [serverMsg, setServerMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    setServerMsg("");
    try {
      await createBooking(values);
      setStatus("success");
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setServerMsg(err.message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="bk bk--done">
        <h1>Thank <strong>you</strong></h1>
        <p>Your request is in. We'll reply to {values.email} within 24 hours to confirm your session.</p>
      </section>
    );
  }

  const Field = ({ name, label, children }) => (
    <div className="bk__field">
      <label htmlFor={name}>{label}</label>
      {children}
      {errors[name] && <span className="bk__error" role="alert">{errors[name]}</span>}
    </div>
  );

  return (
    <section className="bk">
      <h1 className="bk__title"><span>Book your</span> <strong>Session</strong></h1>

      <form className="bk__form" onSubmit={onSubmit} noValidate>
        <Field name="name" label="Full name">
          <input id="name" name="name" value={values.name} onChange={onChange} autoComplete="name" />
        </Field>

        <Field name="email" label="Email">
          <input id="email" name="email" type="email" value={values.email} onChange={onChange} autoComplete="email" />
        </Field>

        <Field name="phone" label="Phone (optional)">
          <input id="phone" name="phone" type="tel" value={values.phone} onChange={onChange} autoComplete="tel" />
        </Field>

        <Field name="package" label="Package">
          <select id="package" name="package" value={values.package} onChange={onChange}>
            <option value="">Select a package</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>{p.title.join(" ")} — ${p.price}</option>
            ))}
          </select>
        </Field>

        <Field name="type" label="Shoot type">
          <select id="type" name="type" value={values.type} onChange={onChange}>
            <option value="">Select a type</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <Field name="date" label="Preferred date">
          <input id="date" name="date" type="date" min={today} value={values.date} onChange={onChange} />
        </Field>

        <Field name="message" label="Tell us about your shoot (optional)">
          <textarea id="message" name="message" rows="4" value={values.message} onChange={onChange} />
        </Field>

        {/* Honeypot: hidden from people, bots fill it in */}
        <input
          name="website" value={values.website} onChange={onChange}
          tabIndex="-1" autoComplete="off" aria-hidden="true" className="bk__hp"
        />

        {serverMsg && <p className="bk__error bk__error--form" role="alert">{serverMsg}</p>}

        <button className="btn-dark" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Request booking"}
        </button>
      </form>
    </section>
  );
}