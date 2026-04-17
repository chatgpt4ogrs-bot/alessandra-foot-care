import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Stethoscope, User, FileText, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  createPatient,
  updatePatient,
  type PatientInput,
  type YesNo,
  emptyPatient,
} from "@/lib/patients";

interface PatientFormProps {
  initial?: PatientInput;
  patientId?: string;
  mode: "create" | "edit";
}

function YesNoField({
  label,
  value,
  onChange,
  name,
}: {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
  name: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as YesNo)}
        className="flex gap-6"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="sim" id={`${name}-sim`} />
          <Label htmlFor={`${name}-sim`} className="font-normal cursor-pointer">
            Sim
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="nao" id={`${name}-nao`} />
          <Label htmlFor={`${name}-nao`} className="font-normal cursor-pointer">
            Não
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export function PatientForm({ initial, patientId, mode }: PatientFormProps) {
  const navigate = useNavigate();
  const [data, setData] = useState<PatientInput>(initial ?? emptyPatient);

  const set = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!data.nome.trim()) {
      toast.error("Informe o nome do paciente.");
      return;
    }
    if (mode === "create") {
      const p = createPatient(data);
      toast.success("Paciente cadastrado!");
      navigate({ to: "/paciente/$id", params: { id: p.id } });
    } else if (patientId) {
      updatePatient(patientId, data);
      toast.success("Paciente atualizado!");
      navigate({ to: "/paciente/$id", params: { id: patientId } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <Button type="submit" size="lg">
          <Save className="h-4 w-4 mr-2" />
          {mode === "create" ? "Cadastrar" : "Salvar alterações"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="h-5 w-5 text-primary" />
            Ficha de Anamnese
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <YesNoField
            label="Possui diabetes?"
            value={data.diabetes}
            onChange={(v) => set("diabetes", v)}
            name="diabetes"
          />
          <YesNoField
            label="Possui hipertensão?"
            value={data.hipertensao}
            onChange={(v) => set("hipertensao", v)}
            name="hipertensao"
          />
          <YesNoField
            label="Está gestante?"
            value={data.gestante}
            onChange={(v) => set("gestante", v)}
            name="gestante"
          />
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="medicamentos">Faz uso de medicamentos?</Label>
            <Textarea
              id="medicamentos"
              value={data.medicamentos}
              onChange={(e) => set("medicamentos", e.target.value)}
              placeholder="Liste os medicamentos..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="alergias">Possui alergias?</Label>
            <Textarea
              id="alergias"
              value={data.alergias}
              onChange={(e) => set("alergias", e.target.value)}
              placeholder="Descreva alergias conhecidas..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="problemasPes">Já teve problemas nos pés?</Label>
            <Textarea
              id="problemasPes"
              value={data.problemasPes}
              onChange={(e) => set("problemasPes", e.target.value)}
              placeholder="Descreva problemas anteriores..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="observacoesClinicas">Observações clínicas</Label>
            <Textarea
              id="observacoesClinicas"
              value={data.observacoesClinicas}
              onChange={(e) => set("observacoesClinicas", e.target.value)}
              rows={3}
            />
          </div>
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
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input
              id="nome"
              value={data.nome}
              onChange={(e) => set("nome", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={data.cpf}
              onChange={(e) => set("cpf", e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataNascimento">Data de nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={data.dataNascimento}
              onChange={(e) => set("dataNascimento", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone (WhatsApp)</Label>
            <Input
              id="telefone"
              value={data.telefone}
              onChange={(e) => set("telefone", e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={data.endereco}
              onChange={(e) => set("endereco", e.target.value)}
            />
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
          <Textarea
            value={data.observacoesFinais}
            onChange={(e) => set("observacoesFinais", e.target.value)}
            placeholder="Observações gerais, histórico adicional, evolução do paciente..."
            rows={6}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          <Save className="h-4 w-4 mr-2" />
          {mode === "create" ? "Cadastrar paciente" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
