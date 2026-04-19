import { createFileRoute } from "@tanstack/react-router";
import { Users, CalendarDays } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/site-header";
import { PatientsList } from "@/components/patients-list";
import { AgendaView } from "@/components/agenda-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alessandra Podóloga — Gestão de Pacientes" },
      {
        name: "description",
        content:
          "Sistema de gestão de pacientes e agenda para podologia. Cadastre pacientes e organize seus atendimentos.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Tabs defaultValue="pacientes" className="w-full">
          <TabsList className="mb-8 h-11 bg-muted/60">
            <TabsTrigger value="pacientes" className="gap-1.5 px-4">
              <Users className="h-4 w-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="agenda" className="gap-1.5 px-4">
              <CalendarDays className="h-4 w-4" />
              Agenda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pacientes">
            <PatientsList />
          </TabsContent>

          <TabsContent value="agenda">
            <AgendaView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
