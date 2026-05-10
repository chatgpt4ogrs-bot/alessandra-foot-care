import { useEffect, useState } from "react";
import { getAllPatients, getCachedPatients, getPatient, type Patient } from "@/lib/patients";

let lastFetch = 0;
const STALE_MS = 30_000;

export function usePatients() {
  const cached = getCachedPatients();
  const [patients, setPatients] = useState<Patient[]>(cached ?? []);
  const [loaded, setLoaded] = useState(cached !== null);

  useEffect(() => {
    let cancelled = false;
    const load = async (force = false) => {
      const now = Date.now();
      if (!force && getCachedPatients() && now - lastFetch < STALE_MS) return;
      const all = await getAllPatients();
      lastFetch = Date.now();
      if (!cancelled) {
        setPatients(all);
        setLoaded(true);
      }
    };
    load();
    const handler = () => load(true);
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
    // Seed from cached list immediately to avoid blank flash
    const cached = getCachedPatients()?.find((p) => p.id === id);
    if (cached) {
      setPatient(cached);
      setLoaded(true);
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
