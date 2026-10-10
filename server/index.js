import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bookings from "./routes/bookings.js";
import admin from "./routes/admin.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => res.send("Luxe Frame API is running."));
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/bookings", bookings);
app.use("/api/admin", admin);

app.use((req, res) => res.status(404).json({ message: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error. Please try again." });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`API running on http://localhost:5000`)
);