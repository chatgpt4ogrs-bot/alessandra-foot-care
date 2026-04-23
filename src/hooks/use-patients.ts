import { useEffect, useState } from "react";
import { getAllPatients, getPatient, type Patient } from "@/lib/patients";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const all = await getAllPatients();
      if (!cancelled) {
        setPatients(all);
        setLoaded(true);
      }
    };
    load();
    const handler = () => load();
    window.addEventListener("patients-updated", handler);
    return () => {
      cancelled = true;
      window.removeEventListener("patients-updated", handler);
    };
  }, []);

  return { patients, loaded };
}

export function usePatient(id: string | undefined) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setLoaded(true);
      return;
    }
    const refresh = async () => {
      const p = await getPatient(id);
      if (!cancelled) {
        setPatient(p);
        setLoaded(true);
      }
    };
    refresh();
    window.addEventListener("patients-updated", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("patients-updated", refresh);
    };
  }, [id]);

  return { patient, loaded };
}
