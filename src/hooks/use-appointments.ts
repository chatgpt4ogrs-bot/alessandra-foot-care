import { useEffect, useState } from "react";
import {
  getAllAppointments,
  getCachedAppointments,
  type Appointment,
} from "@/lib/appointments";

let lastFetch = 0;
const STALE_MS = 30_000;

export function useAppointments() {
  const cached = getCachedAppointments();
  const [appointments, setAppointments] = useState<Appointment[]>(cached ?? []);
  const [loaded, setLoaded] = useState(cached !== null);

  useEffect(() => {
    let cancelled = false;
    const load = async (force = false) => {
      const now = Date.now();
      if (!force && getCachedAppointments() && now - lastFetch < STALE_MS) return;
      const all = await getAllAppointments();
      lastFetch = Date.now();
      if (!cancelled) {
        setAppointments(all);
        setLoaded(true);
      }
    };
    load();
    const handler = () => load(true);
    window.addEventListener("appointments-updated", handler);
    return () => {
      cancelled = true;
      window.removeEventListener("appointments-updated", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { appointments, loaded };
}
