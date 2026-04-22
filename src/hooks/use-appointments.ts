import { useEffect, useState } from "react";
import { getAllAppointments, type Appointment } from "@/lib/appointments";
import { supabase } from "@/integrations/supabase/client";

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
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      cancelled = true;
      window.removeEventListener("appointments-updated", handler);
      sub.subscription.unsubscribe();
    };
  }, []);

  return { appointments, loaded };
}
