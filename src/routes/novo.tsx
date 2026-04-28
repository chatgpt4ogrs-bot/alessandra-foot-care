import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
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
      <AppLayout>
        <div className="w-full max-w-3xl mx-auto px-8 py-8">
          <h2 className="font-serif text-3xl text-foreground mb-6">
            Nova Paciente
          </h2>
          <PatientForm mode="create" />
        </div>
      </AppLayout>
    </RequireAuth>
  );
}
