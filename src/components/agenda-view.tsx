import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Plus, Trash2, User, CalendarDays, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QuickPatientDialog } from "@/components/quick-patient-dialog";
import { usePatients } from "@/hooks/use-patients";
import { useAppointments } from "@/hooks/use-appointments";
import { createAppointment, deleteAppointment } from "@/lib/appointments";

export function AgendaView() {
  const { patients } = usePatients();
  const { appointments } = useAppointments();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [patientId, setPatientId] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);

  const dayAppointments = useMemo(() => {
    return appointments
      .filter((a) => isSameDay(parseISO(a.date), selectedDate))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

  const datesWithAppointments = useMemo(
    () => appointments.map((a) => parseISO(a.date)),
    [appointments],
  );

  function getPatientName(id: string) {
    return patients.find((p) => p.id === id)?.nome ?? "Paciente removido";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientId) {
      toast.error("Selecione uma paciente.");
      return;
    }
    if (!time) {
      toast.error("Informe o horário.");
      return;
    }
    createAppointment({
      patientId,
      date: format(selectedDate, "yyyy-MM-dd"),
      time,
      notes,
    });
    toast.success("Atendimento agendado!");
    setPatientId("");
    setTime("");
    setNotes("");
  }

  function handleDelete(id: string) {
    deleteAppointment(id);
    toast.success("Atendimento removido.");
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-3xl text-foreground">Agenda</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Cadastre e visualize os atendimentos das suas pacientes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card>
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              locale={ptBR}
              modifiers={{ booked: datesWithAppointments }}
              modifiersClassNames={{
                booked:
                  "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary",
              }}
              className="pointer-events-auto"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-serif text-xl text-foreground mb-1 flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Novo atendimento
              </h3>
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>

              {patients.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Nenhuma paciente cadastrada ainda.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setQuickOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Novo paciente
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/novo">
                        <Plus className="h-4 w-4 mr-1" />
                        Cadastro completo
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label>Paciente</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-primary hover:text-primary"
                        onClick={() => setQuickOpen(true)}
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1" />
                        Novo paciente
                      </Button>
                    </div>
                    <Select value={patientId} onValueChange={setPatientId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(selectedDate, "dd/MM/yyyy")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(d) => d && setSelectedDate(d)}
                            locale={ptBR}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="time">Horário</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Procedimento, observações..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="justify-self-start">
                    <Plus className="h-4 w-4 mr-1" />
                    Agendar
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div>
            <h3 className="font-serif text-xl text-foreground mb-3">
              Atendimentos do dia
            </h3>
            {dayAppointments.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-accent/40 flex items-center justify-center mb-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nenhum atendimento agendado para esta data.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {dayAppointments.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="py-4 flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center min-w-16 px-3 py-2 rounded-lg bg-accent/40">
                        <Clock className="h-4 w-4 text-primary mb-0.5" />
                        <span className="font-medium text-foreground">
                          {a.time}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to="/paciente/$id"
                          params={{ id: a.patientId }}
                          className="font-medium text-foreground hover:text-primary inline-flex items-center gap-1.5"
                        >
                          <User className="h-3.5 w-3.5" />
                          {getPatientName(a.patientId)}
                        </Link>
                        {a.notes && (
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {a.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(a.id)}
                        aria-label="Remover atendimento"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickPatientDialog
        open={quickOpen}
        onOpenChange={setQuickOpen}
        initialDate={selectedDate}
        onCreated={(newId) => setPatientId(newId)}
      />
    </div>
  );
}
