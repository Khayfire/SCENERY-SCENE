import { Router } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { createHash, timingSafeEqual } from "node:crypto";
import { getBookings, updateBooking, deleteBooking } from "../store.js";

const router = Router();
const STATUSES = ["new", "confirmed", "completed", "cancelled"];
const sha = (s) => createHash("sha256").update(String(s)).digest();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many attempts. Try again in 15 minutes." },
});

function requireAdmin(req, res, next) {
  const token = req.get("authorization")?.replace(/^Bearer /, "");
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

router.post("/login", loginLimiter, (req, res) => {
  const expected = process.env.ADMIN_PASSWORD;
  // hashing both sides gives equal-length buffers, so the comparison is constant-time
  const ok = expected && timingSafeEqual(sha(req.body?.password ?? ""), sha(expected));
  if (!ok) return res.status(401).json({ message: "Incorrect password." });

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ token });
});

router.get("/bookings", requireAdmin, async (req, res, next) => {
  try {
    const all = await getBookings();
    res.json(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))); // newest first
  } catch (err) {
    next(err);
  }
});

router.patch("/bookings/:id", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body ?? {};
    if (!STATUSES.includes(status)) return res.status(400).json({ message: "Invalid status." });
    const updated = await updateBooking(req.params.id, { status });
    if (!updated) return res.status(404).json({ message: "Booking not found." });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/bookings/:id", requireAdmin, async (req, res, next) => {
  try {
    const removed = await deleteBooking(req.params.id);
    if (!removed) return res.status(404).json({ message: "Booking not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;