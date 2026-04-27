import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SectionNav } from "@/components/section-nav";
import { PatientsList } from "@/components/patients-list";
import { RequireAuth } from "@/components/require-auth";

export const Route = createFileRoute("/pacientes")({
  head: () => ({
    meta: [
      { title: "Pacientes — Alessandra Podóloga" },
      {
        name: "description",
        content: "Gerencie a lista de pacientes da clínica de podologia.",
      },
    ],
  }),
  component: PacientesPage,
});

function PacientesPage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <SectionNav />
        <main className="mx-auto max-w-5xl px-4 py-10 animate-in fade-in duration-300">
          <PatientsList />
        </main>
      </div>
    </RequireAuth>
  );
}
