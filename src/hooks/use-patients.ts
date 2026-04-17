import { useEffect, useState } from "react";
import { getAllPatients, type Patient } from "@/lib/patients";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPatients(getAllPatients());
    setLoaded(true);
    const handler = () => setPatients(getAllPatients());
    window.addEventListener("patients-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("patients-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { patients, loaded };
}

export function usePatient(id: string | undefined) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoaded(true);
      return;
    }
    const refresh = () => {
      const all = getAllPatients();
      setPatient(all.find((p) => p.id === id) ?? null);
      setLoaded(true);
    };
    refresh();
    window.addEventListener("patients-updated", refresh);
    return () => window.removeEventListener("patients-updated", refresh);
  }, [id]);

  return { patient, loaded };
}
