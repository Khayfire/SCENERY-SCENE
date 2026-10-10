import { useAuth } from "./AuthContext";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import "./Admin.css";

export default function Admin() {
  const { token } = useAuth();
  return token ? <AdminDashboard /> : <AdminLogin />;
}