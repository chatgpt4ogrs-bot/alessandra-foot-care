import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { PatientForm } from "@/components/patient-form";
import { usePatient } from "@/hooks/use-patients";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/paciente_/$id/editar")({
  head: () => ({
    meta: [{ title: "Editar Paciente — Alessandra Podóloga" }],
  }),
  component: EditarPaciente,
});

function EditarPaciente() {
  const { id } = Route.useParams();
  const { patient, loaded } = usePatient(id);

  if (!loaded) {
    return (
      <AppLayout>
        <div className="px-8 py-8" />
      </AppLayout>
    );
  }

  if (!patient) {
    return (
      <AppLayout>
        <div className="px-8 py-10 text-center">
          <p className="text-muted-foreground mb-4">Paciente não encontrada.</p>
          <Button asChild>
            <Link to="/">Voltar</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const { id: _id, createdAt: _c, updatedAt: _u, ...initial } = patient;

  return (
    <AppLayout>
      <div className="w-full max-w-3xl mx-auto px-8 py-8">
        <h2 className="font-serif text-3xl text-foreground mb-6">
          Editar Paciente
        </h2>
        <PatientForm mode="edit" patientId={patient.id} initial={initial} />
      </div>
    </AppLayout>
  );
}
