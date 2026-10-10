const PACKAGES = ["one", "two", "three"];
const TYPES = ["events", "fashion", "creativity", "weddings"];
const str = (v) => (typeof v === "string" ? v.trim() : "");

export function validateBooking(body = {}) {
  const data = {
    name: str(body.name),
    email: str(body.email).toLowerCase(),
    phone: str(body.phone),
    package: str(body.package),
    type: str(body.type),
    date: str(body.date),
    message: str(body.message),
  };
  const errors = {};

  if (data.name.length < 2 || data.name.length > 80) errors.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(data.email) || data.email.length > 120) errors.email = "Enter a valid email address.";
  if (data.phone && !/^[+\d][\d\s()-]{6,19}$/.test(data.phone)) errors.phone = "Enter a valid phone number.";
  if (!PACKAGES.includes(data.package)) errors.package = "Choose a package.";
  if (!TYPES.includes(data.type)) errors.type = "Choose a shoot type.";

  const day = new Date(`${data.date}T00:00:00`);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (Number.isNaN(day.getTime())) errors.date = "Pick a preferred date.";
  else if (day < start) errors.date = "Date can't be in the past.";

  if (data.message.length > 1000) errors.message = "Keep it under 1000 characters.";

  return { data, errors };
}