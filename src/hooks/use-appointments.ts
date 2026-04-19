import { useEffect, useState } from "react";
import { getAllAppointments, type Appointment } from "@/lib/appointments";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAppointments(getAllAppointments());
    setLoaded(true);
    const handler = () => setAppointments(getAllAppointments());
    window.addEventListener("appointments-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("appointments-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { appointments, loaded };
}
