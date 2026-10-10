import { createContext, useContext, useState, useCallback } from "react";

const AuthCtx = createContext(null);
const KEY = "lf_admin_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return sessionStorage.getItem(KEY); } catch { return null; }
  });

  const login = useCallback((t) => {
    setToken(t);
    try { sessionStorage.setItem(KEY, t); } catch {}
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    try { sessionStorage.removeItem(KEY); } catch {}
  }, []);

  return <AuthCtx.Provider value={{ token, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);