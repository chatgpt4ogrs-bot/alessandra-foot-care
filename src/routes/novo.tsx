import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { PatientForm } from "@/components/patient-form";
import { RequireAuth } from "@/components/require-auth";

export const Route = createFileRoute("/novo")({
  head: () => ({
    meta: [
      { title: "Cadastrar Paciente — Alessandra Podóloga" },
      { name: "description", content: "Cadastre uma nova paciente." },
    ],
  }),
  component: NovoPaciente,
});

function NovoPaciente() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="font-serif text-3xl text-foreground mb-6">
            Nova Paciente
          </h2>
          <PatientForm mode="create" />
        </main>
      </div>
    </RequireAuth>
  );
}
