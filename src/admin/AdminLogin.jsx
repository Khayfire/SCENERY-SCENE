import { useState } from "react";
import { adminLogin } from "../api";
import { useAuth } from "./AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await adminLogin(password);
      login(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-login">
      <form onSubmit={onSubmit}>
        <p className="adm-brand">LUXE FRAME</p>
        <h1>Admin <strong>Login</strong></h1>
        <label htmlFor="pw">Password</label>
        <input
          id="pw" type="password" value={password} autoFocus
          autoComplete="current-password" onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="adm-error" role="alert">{error}</p>}
        <button className="btn-dark" disabled={busy || !password}>
          {busy ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}