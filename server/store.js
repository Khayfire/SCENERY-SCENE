import { readFile, writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const DIR = new URL("./data/", import.meta.url);
const FILE = new URL("./data/bookings.json", import.meta.url);

export async function getBookings() {
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function save(all) {
  await mkdir(DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(all, null, 2));
}

export async function addBooking(data) {
  const all = await getBookings();
  const booking = { id: randomUUID(), ...data, status: "new", createdAt: new Date().toISOString() };
  all.push(booking);
  await save(all);
  return booking;
}

export async function updateBooking(id, patch) {
  const all = await getBookings();
  const i = all.findIndex((b) => b.id === id);
  if (i === -1) return null;
  all[i] = { ...all[i], ...patch };
  await save(all);
  return all[i];
}

export async function deleteBooking(id) {
  const all = await getBookings();
  const next = all.filter((b) => b.id !== id);
  if (next.length === all.length) return false;
  await save(next);
  return true;
}