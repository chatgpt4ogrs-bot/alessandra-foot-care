import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
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
      <AppLayout>
        <div className="px-8 py-8">
          <PatientsList />
        </div>
      </AppLayout>
    </RequireAuth>
  );
}
