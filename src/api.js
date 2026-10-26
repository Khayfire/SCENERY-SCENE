const BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "https://scenery-scene-1.onrender.com" : ""); // empty in dev, thanks to the proxy

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed.");
    err.status = res.status;
    err.fieldErrors = data.errors || {};
    throw err;
  }
  return data;
}

// Public
export const createBooking = (data) =>
  request("/api/bookings", { method: "POST", body: data });

// Admin
export const adminLogin = (password) =>
  request("/api/admin/login", { method: "POST", body: { password } });

export const adminGetBookings = (token) =>
  request("/api/admin/bookings", { token });

export const adminUpdateBooking = (token, id, status) =>
  request(`/api/admin/bookings/${id}`, { method: "PATCH", token, body: { status } });

export const adminDeleteBooking = (token, id) =>
  request(`/api/admin/bookings/${id}`, { method: "DELETE", token });