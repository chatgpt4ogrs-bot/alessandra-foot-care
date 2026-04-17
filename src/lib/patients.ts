export type YesNo = "sim" | "nao" | "";

export interface Patient {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Dados pessoais
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco: string;
  // Anamnese
  diabetes: YesNo;
  hipertensao: YesNo;
  medicamentos: string;
  alergias: string;
  problemasPes: string;
  gestante: YesNo;
  observacoesClinicas: string;
  // Observações finais
  observacoesFinais: string;
}

export type PatientInput = Omit<Patient, "id" | "createdAt" | "updatedAt">;

const STORAGE_KEY = "alessandra-podologa-patients";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAllPatients(): Patient[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Patient[];
  } catch {
    return [];
  }
}

export function getPatient(id: string): Patient | null {
  return getAllPatients().find((p) => p.id === id) ?? null;
}

function save(patients: Patient[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  window.dispatchEvent(new Event("patients-updated"));
}

export function createPatient(input: PatientInput): Patient {
  const now = new Date().toISOString();
  const patient: Patient = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const all = getAllPatients();
  save([patient, ...all]);
  return patient;
}

export function updatePatient(id: string, input: PatientInput): Patient | null {
  const all = getAllPatients();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated: Patient = {
    ...all[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  save(all);
  return updated;
}

export function deletePatient(id: string) {
  save(getAllPatients().filter((p) => p.id !== id));
}

export const emptyPatient: PatientInput = {
  nome: "",
  cpf: "",
  dataNascimento: "",
  telefone: "",
  email: "",
  endereco: "",
  diabetes: "",
  hipertensao: "",
  medicamentos: "",
  alergias: "",
  problemasPes: "",
  gestante: "",
  observacoesClinicas: "",
  observacoesFinais: "",
};
