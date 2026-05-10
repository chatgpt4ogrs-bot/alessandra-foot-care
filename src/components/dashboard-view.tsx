import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Users, CalendarDays, AlertTriangle, CalendarClock, ArrowRight } from "lucide-react";
import { format, isSameDay, parseISO, isAfter, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { usePatients } from "@/hooks/use-patients";
import { useAppointments } from "@/hooks/use-appointments";
import { useProducts } from "@/hooks/use-products";
import { isLowStock } from "@/lib/products";

interface MetricCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon: typeof Users;
  accent?: "primary" | "accent" | "destructive" | "muted";
  to: "/pacientes" | "/agenda" | "/estoque";
}

function MetricCard({ label, value, hint, icon: Icon, accent = "primary", to }: MetricCardProps) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    destructive: "bg-destructive/10 text-destructive",
    muted: "bg-muted text-muted-foreground",
  } as const;

  return (
    <Link to={to} className="block group">
      <Card className="p-5 h-full transition-all hover:shadow-md hover:border-primary/30">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${accentMap[accent]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </Card>
    </Link>
  );
}

export function DashboardView() {
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { products } = useProducts();

  const today = startOfToday();

  const todayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => isSameDay(parseISO(a.date), today))
        .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, today],
  );

  const upcoming = useMemo(
    () =>
      appointments
        .filter((a) => {
          const d = parseISO(a.date);
          return isAfter(d, today) || isSameDay(d, today);
        })
        .sort((a, b) =>
          a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
        )
        .slice(0, 5),
    [appointments, today],
  );

  const lowStock = useMemo(() => products.filter((p) => isLowStock(p)), [products]);

  function patientName(id: string) {
    return patients.find((p) => p.id === id)?.nome ?? "Paciente removido";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Início</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral da sua rotina de atendimentos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Pacientes cadastrados"
          value={patients.length}
          hint={patients.length === 0 ? "Cadastre seu primeiro paciente" : "Total no sistema"}
          icon={Users}
          accent="primary"
          to="/pacientes"
        />
        <MetricCard
          label="Atendimentos de hoje"
          value={todayAppointments.length}
          hint={format(today, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          icon={CalendarDays}
          accent="accent"
          to="/agenda"
        />
        <MetricCard
          label="Estoque baixo"
          value={lowStock.length}
          hint={
            lowStock.length === 0
              ? "Tudo em ordem"
              : `${lowStock.length} produto${lowStock.length > 1 ? "s" : ""} para repor`
          }
          icon={AlertTriangle}
          accent={lowStock.length > 0 ? "destructive" : "muted"}
          to="/estoque"
        />
        <MetricCard
          label="Próximos agendamentos"
          value={upcoming.length}
          hint="Hoje em diante"
          icon={CalendarClock}
          accent="primary"
          to="/agenda"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-foreground">Próximos agendamentos</h2>
            </div>
            <Link to="/agenda" className="text-xs font-medium text-primary hover:underline">
              Ver agenda
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhum agendamento futuro.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {upcoming.map((a) => (
                <li key={a.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {patientName(a.patientId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(a.date), "dd 'de' MMM", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                    {a.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h2 className="font-semibold text-foreground">Estoque baixo</h2>
            </div>
            <Link to="/estoque" className="text-xs font-medium text-primary hover:underline">
              Ver estoque
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Todos os produtos estão com estoque saudável.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {lowStock.slice(0, 5).map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">Mínimo: {p.quantidadeMinima}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-destructive bg-destructive/10 px-2.5 py-1 rounded-md">
                    {p.quantidade}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
