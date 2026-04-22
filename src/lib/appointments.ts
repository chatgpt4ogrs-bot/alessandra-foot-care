import { supabase } from "@/integrations/supabase/client";

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

export type AppointmentInput = Omit<Appointment, "id" | "createdAt">;

function notify() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("appointments-updated"));
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
  const { data, error } = await supabase
    .from("agendamentos")
    .select("*")
    .order("data", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []).map(rowToAppointment);
}

export async function createAppointment(
  input: AppointmentInput,
): Promise<Appointment | null> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;
  const { data, error } = await supabase
    .from("agendamentos")
    .insert({
      user_id: userId,
      paciente_id: input.patientId,
      data: input.date,
      horario: input.time,
      observacoes: input.notes,
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
  const { data, error } = await supabase
    .from("agendamentos")
    .update({
      paciente_id: input.patientId,
      data: input.date,
      horario: input.time,
      observacoes: input.notes,
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  notify();
  return rowToAppointment(data);
}
