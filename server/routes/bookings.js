import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validateBooking } from "../validate.js";
import { addBooking, getBookings } from "../store.js";
import { sendBookingEmails } from "../mail.js";

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5, // 5 submissions per IP per 15 min
  message: { message: "Too many requests. Please try again later." },
});


router.post("/", limiter, async (req, res, next) => {
  try {
    if (req.body?.website) return res.status(201).json({ ok: true }); // honeypot: pretend success

    const { data, errors } = validateBooking(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Please fix the highlighted fields.", errors });
    }

    const booking = await addBooking(data);
    sendBookingEmails(booking).catch((e) => console.error("Email failed:", e.message)); // don't block the response
    res.status(201).json({ ok: true, id: booking.id });
  } catch (err) {
    next(err);
  }
});



export default router;