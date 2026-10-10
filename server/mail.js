import nodemailer from "nodemailer";

const enabled = Boolean(process.env.SMTP_HOST);
const transport = enabled
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

export async function sendBookingEmails(b) {
  if (!enabled) return;
  const from = `"Luxe Frame" <${process.env.SMTP_USER}>`;
  const summary =
    `Package: ${b.package}\nType: ${b.type}\nDate: ${b.date}\n` +
    `Phone: ${b.phone || "-"}\n\n${b.message || ""}`;

  await Promise.all([
    transport.sendMail({
      from, to: process.env.OWNER_EMAIL, replyTo: b.email,
      subject: `New booking request from ${b.name}`,
      text: `${b.name} <${b.email}>\n${summary}`,
    }),
    transport.sendMail({
      from, to: b.email,
      subject: "We received your Luxe Frame request",
      text: `Hi ${b.name},\n\nThanks for your request. We'll confirm within 24 hours.\n\n${summary}`,
    }),
  ]);
}