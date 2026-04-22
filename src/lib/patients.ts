import { supabase } from "@/integrations/supabase/client";

export type YesNo = "sim" | "nao" | "";
export type TipoCalcado = "aberto" | "fechado" | "salto" | "sapato_baixo" | "";
export type TipoMeia = "algodao" | "nylon" | "";

export interface Patient {
  id: string;
  createdAt: string;
  updatedAt: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco: string;
  diabetes: YesNo;
  hipertensao: YesNo;
  medicamentos: string;
  alergias: string;
  problemasPes: string;
  gestante: YesNo;
  observacoesClinicas: string;
  tipoCalcado: TipoCalcado;
  tipoMeia: TipoMeia;
  cirurgiaMembrosInferiores: YesNo;
  cirurgiaMembrosInferioresQual: string;
  praticaEsporte: YesNo;
  praticaEsporteQual: string;
  tomaMedicamento: YesNo;
  tomaMedicamentoQual: string;
  marcaPassosPinos: YesNo;
  problemasCancerigenos: YesNo;
  pressaoAlta: YesNo;
  diabetesCondicao: YesNo;
  convulsoes: YesNo;
  problemasCirculatorios: YesNo;
  alergia: YesNo;
  observacoesFinais: string;
}

export type PatientInput = Omit<Patient, "id" | "createdAt" | "updatedAt">;

function notify() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("patients-updated"));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPatient(r: any): Patient {
  return {
    id: r.id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    nome: r.nome ?? "",
    cpf: r.cpf ?? "",
    dataNascimento: r.data_nascimento ?? "",
    telefone: r.telefone ?? "",
    email: r.email ?? "",
    endereco: r.endereco ?? "",
    diabetes: (r.diabetes ?? "") as YesNo,
    hipertensao: (r.hipertensao ?? "") as YesNo,
    medicamentos: r.medicamentos ?? "",
    alergias: r.alergias ?? "",
    problemasPes: r.problemas_pes ?? "",
    gestante: (r.gestante ?? "") as YesNo,
    observacoesClinicas: r.observacoes_clinicas ?? "",
    tipoCalcado: (r.tipo_calcado ?? "") as TipoCalcado,
    tipoMeia: (r.tipo_meia ?? "") as TipoMeia,
    cirurgiaMembrosInferiores: (r.cirurgia_membros_inferiores ?? "") as YesNo,
    cirurgiaMembrosInferioresQual: r.cirurgia_membros_inferiores_qual ?? "",
    praticaEsporte: (r.pratica_esporte ?? "") as YesNo,
    praticaEsporteQual: r.pratica_esporte_qual ?? "",
    tomaMedicamento: (r.toma_medicamento ?? "") as YesNo,
    tomaMedicamentoQual: r.toma_medicamento_qual ?? "",
    marcaPassosPinos: (r.marca_passos_pinos ?? "") as YesNo,
    problemasCancerigenos: (r.problemas_cancerigenos ?? "") as YesNo,
    pressaoAlta: (r.pressao_alta ?? "") as YesNo,
    diabetesCondicao: (r.diabetes_condicao ?? "") as YesNo,
    convulsoes: (r.convulsoes ?? "") as YesNo,
    problemasCirculatorios: (r.problemas_circulatorios ?? "") as YesNo,
    alergia: (r.alergia ?? "") as YesNo,
    observacoesFinais: r.observacoes_finais ?? "",
  };
}

function inputToRow(input: PatientInput) {
  return {
    nome: input.nome,
    cpf: input.cpf,
    data_nascimento: input.dataNascimento,
    telefone: input.telefone,
    email: input.email,
    endereco: input.endereco,
    diabetes: input.diabetes,
    hipertensao: input.hipertensao,
    medicamentos: input.medicamentos,
    alergias: input.alergias,
    problemas_pes: input.problemasPes,
    gestante: input.gestante,
    observacoes_clinicas: input.observacoesClinicas,
    tipo_calcado: input.tipoCalcado,
    tipo_meia: input.tipoMeia,
    cirurgia_membros_inferiores: input.cirurgiaMembrosInferiores,
    cirurgia_membros_inferiores_qual: input.cirurgiaMembrosInferioresQual,
    pratica_esporte: input.praticaEsporte,
    pratica_esporte_qual: input.praticaEsporteQual,
    toma_medicamento: input.tomaMedicamento,
    toma_medicamento_qual: input.tomaMedicamentoQual,
    marca_passos_pinos: input.marcaPassosPinos,
    problemas_cancerigenos: input.problemasCancerigenos,
    pressao_alta: input.pressaoAlta,
    diabetes_condicao: input.diabetesCondicao,
    convulsoes: input.convulsoes,
    problemas_circulatorios: input.problemasCirculatorios,
    alergia: input.alergia,
    observacoes_finais: input.observacoesFinais,
  };
}

export async function getAllPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from("pacientes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []).map(rowToPatient);
}

export async function getPatient(id: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToPatient(data);
}

export async function createPatient(input: PatientInput): Promise<Patient | null> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;
  const { data, error } = await supabase
    .from("pacientes")
    .insert({ ...inputToRow(input), user_id: userId })
    .select()
    .single();
  if (error || !data) {
    console.error(error);
    return null;
  }
  notify();
  return rowToPatient(data);
}

export async function updatePatient(
  id: string,
  input: PatientInput,
): Promise<Patient | null> {
  const { data, error } = await supabase
    .from("pacientes")
    .update(inputToRow(input))
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  notify();
  return rowToPatient(data);
}

export async function deletePatient(id: string): Promise<void> {
  const { error } = await supabase.from("pacientes").delete().eq("id", id);
  if (error) console.error(error);
  notify();
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
  tipoCalcado: "",
  tipoMeia: "",
  cirurgiaMembrosInferiores: "",
  cirurgiaMembrosInferioresQual: "",
  praticaEsporte: "",
  praticaEsporteQual: "",
  tomaMedicamento: "",
  tomaMedicamentoQual: "",
  marcaPassosPinos: "",
  problemasCancerigenos: "",
  pressaoAlta: "",
  diabetesCondicao: "",
  convulsoes: "",
  problemasCirculatorios: "",
  alergia: "",
  observacoesFinais: "",
};
