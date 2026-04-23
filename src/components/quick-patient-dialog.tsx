import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createPatient, emptyPatient } from "@/lib/patients";
import { createAppointment } from "@/lib/appointments";

interface QuickPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate: Date;
  onCreated: (patientId: string) => void;
}

export function QuickPatientDialog({
  open,
  onOpenChange,
  initialDate,
  onCreated,
}: QuickPatientDialogProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [date, setDate] = useState<Date>(initialDate);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setDate(initialDate);
      setNome("");
      setTelefone("");
      setTime("");
      setNotes("");
    }
  }, [open, initialDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Informe o nome da paciente.");
      return;
    }
    if (!telefone.trim()) {
      toast.error("Informe o telefone (WhatsApp).");
      return;
    }
    if (!time) {
      toast.error("Informe o horário.");
      return;
    }

    try {
      const patient = await createPatient({
        ...emptyPatient,
        nome: nome.trim(),
        telefone: telefone.trim(),
      });

      await createAppointment({
        patientId: patient.id,
        date: format(date, "yyyy-MM-dd"),
        time,
        notes,
      });

      toast.success("Paciente cadastrado e atendimento agendado com sucesso");
      onCreated(patient.id);
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido.";
      console.error("[QuickPatientDialog] failed:", err);
      toast.error(`Erro ao cadastrar: ${msg}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Novo paciente + Agendamento
          </DialogTitle>
          <DialogDescription>
            Cadastro rápido com agendamento vinculado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="qp-nome">Nome completo</Label>
            <Input
              id="qp-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Maria Silva"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="qp-tel">Telefone (WhatsApp)</Label>
            <Input
              id="qp-tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    locale={ptBR}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="qp-time">Horário</Label>
              <Input
                id="qp-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="qp-notes">Observações (opcional)</Label>
            <Textarea
              id="qp-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Procedimento, observações..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <UserPlus className="h-4 w-4 mr-1" />
              Cadastrar e Agendar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
