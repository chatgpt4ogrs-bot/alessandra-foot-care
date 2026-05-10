import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const AppointmentInputSchema = z.object({
  patientId: z.string().uuid("ID de paciente inválido"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  notes: z.string().trim().max(2000).optional().default(""),
});
export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

export type AppointmentInput = Omit<Appointment, "id" | "createdAt">;

let appointmentsCache: Appointment[] | null = null;
let appointmentsInflight: Promise<Appointment[]> | null = null;

export function getCachedAppointments(): Appointment[] | null {
  return appointmentsCache;
}

function notify() {
  appointmentsCache = null;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("appointments-updated"));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAppointment(r: any): Appointment {
  return {
    id: r.id,
    patientId: r.paciente_id,
    date: r.data,
    time: r.horario,
    notes: r.observacoes ?? "",
    createdAt: r.created_at,
  };
}

export async function getAllAppointments(): Promise<Appointment[]> {
  if (appointmentsInflight) return appointmentsInflight;
  appointmentsInflight = (async () => {
    const { data, error } = await supabase
      .from("agendamentos")
      .select("id,paciente_id,data,horario,observacoes,created_at")
      .order("data", { ascending: true });
    appointmentsInflight = null;
    if (error) {
      console.error(error);
      return appointmentsCache ?? [];
    }
    const list = (data ?? []).map(rowToAppointment);
    appointmentsCache = list;
    return list;
  })();
  return appointmentsInflight;
}

export async function createAppointment(input: AppointmentInput): Promise<Appointment | null> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;

  const validData = AppointmentInputSchema.parse(input);

  const { data, error } = await supabase
    .from("agendamentos")
    .insert({
      user_id: userId,
      paciente_id: validData.patientId,
      data: validData.date,
      horario: validData.time,
      observacoes: validData.notes,
    })
    .select()
    .single();
  if (error || !data) {
    console.error(error);
    return null;
  }
  notify();
  return rowToAppointment(data);
}

export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await supabase.from("agendamentos").delete().eq("id", id);
  if (error) console.error(error);
  notify();
}

export async function updateAppointment(
  id: string,
  input: AppointmentInput,
): Promise<Appointment | null> {
  const validData = AppointmentInputSchema.parse(input);

  const { data, error } = await supabase
    .from("agendamentos")
    .update({
      paciente_id: validData.patientId,
      data: validData.date,
      horario: validData.time,
      observacoes: validData.notes,
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  notify();
  return rowToAppointment(data);
}
