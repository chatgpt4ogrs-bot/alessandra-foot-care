import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Stethoscope,
  User,
  FileText,
  MessageCircle,
  Footprints,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { usePatient } from "@/hooks/use-patients";
import { deletePatient, type Patient } from "@/lib/patients";
import { toast } from "sonner";

export const Route = createFileRoute("/paciente/$id")({
  head: () => ({
    meta: [{ title: "Paciente — Alessandra Podóloga" }],
  }),
  component: VerPaciente,
});

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-foreground mt-1 whitespace-pre-wrap">
        {value && value.trim() ? value : <span className="text-muted-foreground/60">—</span>}
      </p>
    </div>
  );
}

function YesNoBadge({ label, value }: { label: string; value: string }) {
  const display =
    value === "sim" ? "Sim" : value === "nao" ? "Não" : "—";
  const cls =
    value === "sim"
      ? "bg-destructive/10 text-destructive"
      : value === "nao"
        ? "bg-primary/15 text-primary"
        : "bg-muted text-muted-foreground";
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
        {label}
      </p>
      <span
        className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium ${cls}`}
      >
        {display}
      </span>
    </div>
  );
}

function whatsappLink(p: Patient) {
  const digits = p.telefone.replace(/\D/g, "");
  if (!digits) return null;
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}`;
}

function VerPaciente() {
  const { id } = Route.useParams();
  const { patient, loaded } = usePatient(id);
  const navigate = useNavigate();

  if (!loaded) {
    return (
      <RequireAuth>
        <AppLayout>
          <div className="px-8 py-8" />
        </AppLayout>
      </RequireAuth>
    );
  }

  if (!patient) {
    return (
      <RequireAuth>
        <AppLayout>
          <div className="px-8 py-10 text-center">
            <p className="text-muted-foreground mb-4">Paciente não encontrada.</p>
            <Button asChild>
              <Link to="/pacientes">Voltar</Link>
            </Button>
          </div>
        </AppLayout>
      </RequireAuth>
    );
  }

  const wa = whatsappLink(patient);

  return (
    <RequireAuth>
      <AppLayout>
        <div className="w-full mx-auto px-8 py-8 max-w-3xl space-y-6">
          <div className="flex items-center justify-between gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/pacientes">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Link>
            </Button>
            <div className="flex gap-2">
              {wa && (
                <Button asChild variant="outline" size="sm">
                  <a href={wa} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </a>
                </Button>
              )}
              <Button asChild size="sm">
                <Link to="/paciente/$id/editar" params={{ id: patient.id }}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir paciente?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await deletePatient(patient.id);
                        toast.success("Paciente excluída.");
                        navigate({ to: "/" });
                      }}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-foreground">{patient.nome}</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope className="h-5 w-5 text-primary" />
                Anamnese
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-3">
              <YesNoBadge label="Gestante" value={patient.gestante} />
              <YesNoBadge label="Hipertensão" value={patient.hipertensao} />
              <YesNoBadge
                label="Cirurgia membros inf."
                value={patient.cirurgiaMembrosInferiores}
              />
              {patient.cirurgiaMembrosInferiores === "sim" && (
                <div className="md:col-span-3">
                  <Field
                    label="Qual cirurgia"
                    value={patient.cirurgiaMembrosInferioresQual}
                  />
                </div>
              )}
              <YesNoBadge
                label="Pratica esporte"
                value={patient.praticaEsporte}
              />
              {patient.praticaEsporte === "sim" && (
                <div className="md:col-span-3">
                  <Field label="Qual esporte" value={patient.praticaEsporteQual} />
                </div>
              )}
              <YesNoBadge
                label="Toma medicamento"
                value={patient.tomaMedicamento}
              />
              {patient.tomaMedicamento === "sim" && (
                <div className="md:col-span-3">
                  <Field
                    label="Qual medicamento"
                    value={patient.tomaMedicamentoQual}
                  />
                </div>
              )}
              <div className="md:col-span-3">
                <Field label="Alergias" value={patient.alergias} />
              </div>
              <div className="md:col-span-3">
                <Field label="Problemas nos pés" value={patient.problemasPes} />
              </div>
              <div className="md:col-span-3">
                <Field
                  label="Observações clínicas"
                  value={patient.observacoesClinicas}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Footprints className="h-5 w-5 text-primary" />
                Hábitos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <Field
                label="Tipo de calçado"
                value={
                  {
                    aberto: "Aberto",
                    fechado: "Fechado",
                    salto: "Salto",
                    sapato_baixo: "Sapato baixo",
                    "": "",
                  }[patient.tipoCalcado]
                }
              />
              <Field
                label="Tipo de meia"
                value={
                  {
                    algodao: "Algodão",
                    nylon: "Nylon",
                    "": "",
                  }[patient.tipoMeia]
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HeartPulse className="h-5 w-5 text-primary" />
                Condições de Saúde
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-3">
              <YesNoBadge
                label="Marca-passo / pinos"
                value={patient.marcaPassosPinos}
              />
              <YesNoBadge
                label="Problemas cancerígenos"
                value={patient.problemasCancerigenos}
              />
              <YesNoBadge label="Pressão alta" value={patient.pressaoAlta} />
              <YesNoBadge label="Diabetes" value={patient.diabetesCondicao} />
              <YesNoBadge label="Convulsões" value={patient.convulsoes} />
              <YesNoBadge
                label="Problemas circulatórios"
                value={patient.problemasCirculatorios}
              />
              <YesNoBadge label="Alergia" value={patient.alergia} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <Field label="CPF" value={patient.cpf} />
              <Field
                label="Data de nascimento"
                value={
                  patient.dataNascimento
                    ? new Date(patient.dataNascimento).toLocaleDateString("pt-BR")
                    : ""
                }
              />
              <Field label="Telefone" value={patient.telefone} />
              <Field label="Email" value={patient.email} />
              <div className="md:col-span-2">
                <Field label="Endereço" value={patient.endereco} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Observações Finais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Field label="" value={patient.observacoesFinais} />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </RequireAuth>
  );
}
