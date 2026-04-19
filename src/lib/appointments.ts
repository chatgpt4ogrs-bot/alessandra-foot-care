export interface Appointment {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string;
  createdAt: string;
}

export type AppointmentInput = Omit<Appointment, "id" | "createdAt">;

const STORAGE_KEY = "alessandra-podologa-appointments";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAllAppointments(): Appointment[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Appointment[];
  } catch {
    return [];
  }
}

function save(appointments: Appointment[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  window.dispatchEvent(new Event("appointments-updated"));
}

export function createAppointment(input: AppointmentInput): Appointment {
  const appointment: Appointment = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const all = getAllAppointments();
  save([...all, appointment]);
  return appointment;
}

export function deleteAppointment(id: string) {
  save(getAllAppointments().filter((a) => a.id !== id));
}

export function updateAppointment(
  id: string,
  input: AppointmentInput,
): Appointment | null {
  const all = getAllAppointments();
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const updated: Appointment = { ...all[idx], ...input };
  all[idx] = updated;
  save(all);
  return updated;
}
