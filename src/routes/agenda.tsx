import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SectionNav } from "@/components/section-nav";
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
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <SectionNav />
        <main className="mx-auto max-w-5xl px-4 py-10 animate-in fade-in duration-300">
          <AgendaView />
        </main>
      </div>
    </RequireAuth>
  );
}
