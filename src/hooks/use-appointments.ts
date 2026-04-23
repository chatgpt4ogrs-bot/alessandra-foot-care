import { useEffect, useState } from "react";
import { getAllAppointments, type Appointment } from "@/lib/appointments";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const all = await getAllAppointments();
      if (!cancelled) {
        setAppointments(all);
        setLoaded(true);
      }
    };
    load();
    const handler = () => load();
    window.addEventListener("appointments-updated", handler);
    return () => {
      cancelled = true;
      window.removeEventListener("appointments-updated", handler);
    };
  }, []);

  return { appointments, loaded };
}
