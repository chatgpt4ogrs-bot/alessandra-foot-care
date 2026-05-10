import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { AgendaView } from "@/components/agenda-view";
import { RequireAuth } from "@/components/require-auth";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda — Alessandra Podóloga" },
      {
        name: "description",
        content: "Agenda de atendimentos e próximos compromissos.",
      },
    ],
  }),
  component: AgendaPage,
});

function AgendaPage() {
  return (
    <RequireAuth>
      <AppLayout>
        <div className="p-4 md:p-8">
          <AgendaView />
        </div>
      </AppLayout>
    </RequireAuth>
  );
}
