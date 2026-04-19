import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
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
      <div className="min-h-screen bg-background">
        <SiteHeader />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-muted-foreground mb-4">Paciente não encontrada.</p>
          <Button asChild>
            <Link to="/">Voltar</Link>
          </Button>
        </main>
      </div>
    );
  }

  const { id: _id, createdAt: _c, updatedAt: _u, ...initial } = patient;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="font-serif text-3xl text-foreground mb-6">
          Editar Paciente
        </h2>
        <PatientForm mode="edit" patientId={patient.id} initial={initial} />
      </main>
    </div>
  );
}
