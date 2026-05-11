import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Stethoscope, User, FileText, Save, ArrowLeft, Footprints, HeartPulse } from "lucide-react";
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
      <RadioGroup value={value} onValueChange={(v) => onChange(v as YesNo)} className="flex gap-6">
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

function OptionsField<T extends string>({
  label,
  value,
  onChange,
  name,
  options,
}: {
  label: string;
  value: T | "";
  onChange: (v: T | "") => void;
  name: string;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as T)}
        className="flex flex-wrap gap-x-6 gap-y-2"
      >
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
            <Label htmlFor={`${name}-${opt.value}`} className="font-normal cursor-pointer">
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

function ConditionalYesNoField({
  label,
  value,
  onChange,
  name,
  detailLabel,
  detailValue,
  onDetailChange,
  detailPlaceholder,
}: {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
  name: string;
  detailLabel: string;
  detailValue: string;
  onDetailChange: (v: string) => void;
  detailPlaceholder?: string;
}) {
  return (
    <div className="space-y-3 md:col-span-2">
      <YesNoField label={label} value={value} onChange={onChange} name={name} />
      {value === "sim" && (
        <div className="space-y-2 border-l-2 border-primary/30 pl-4">
          <Label htmlFor={`${name}-detalhe`} className="text-sm">
            {detailLabel} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id={`${name}-detalhe`}
            value={detailValue}
            onChange={(e) => onDetailChange(e.target.value)}
            placeholder={detailPlaceholder}
            required
          />
        </div>
      )}
    </div>
  );
}

export function PatientForm({ initial, patientId, mode }: PatientFormProps) {
  const navigate = useNavigate();
  const [data, setData] = useState<PatientInput>(initial ?? emptyPatient);

  const set = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data.nome.trim()) {
      toast.error("Informe o nome do paciente.");
      return;
    }
    if (data.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(data.cpf)) {
      toast.error("CPF inválido. Use o formato 000.000.000-00.");
      return;
    }
    if (data.cirurgiaMembrosInferiores === "sim" && !data.cirurgiaMembrosInferioresQual.trim()) {
      toast.error("Informe qual cirurgia nos membros inferiores.");
      return;
    }
    if (data.praticaEsporte === "sim" && !data.praticaEsporteQual.trim()) {
      toast.error("Informe qual esporte é praticado.");
      return;
    }
    if (data.tomaMedicamento === "sim" && !data.tomaMedicamentoQual.trim()) {
      toast.error("Informe qual medicamento é utilizado.");
      return;
    }
    try {
      if (mode === "create") {
        const p = await createPatient(data);
        toast.success("Paciente cadastrado!");
        navigate({ to: "/paciente/$id", params: { id: p.id } });
      } else if (patientId) {
        await updatePatient(patientId, data);
        toast.success("Paciente atualizado!");
        navigate({ to: "/paciente/$id", params: { id: patientId } });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido.";
      console.error("[PatientForm] submit failed:", err);
      toast.error(`Erro ao salvar: ${msg}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/pacientes" })}
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
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").substring(0, 11);
                const formatted = raw
                  .replace(/(\d{3})(\d)/, "$1.$2")
                  .replace(/(\d{3})(\d)/, "$1.$2")
                  .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                set("cpf", formatted);
              }}
              placeholder="000.000.000-00"
              maxLength={14}
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
            <Stethoscope className="h-5 w-5 text-primary" />
            Ficha de Anamnese
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <YesNoField
            label="Está gestante?"
            value={data.gestante}
            onChange={(v) => set("gestante", v)}
            name="gestante"
          />
          <YesNoField
            label="Possui hipertensão?"
            value={data.hipertensao}
            onChange={(v) => set("hipertensao", v)}
            name="hipertensao"
          />

          <ConditionalYesNoField
            label="Já fez cirurgia nos membros inferiores?"
            value={data.cirurgiaMembrosInferiores}
            onChange={(v) => set("cirurgiaMembrosInferiores", v)}
            name="cirurgia"
            detailLabel="Qual cirurgia?"
            detailValue={data.cirurgiaMembrosInferioresQual}
            onDetailChange={(v) => set("cirurgiaMembrosInferioresQual", v)}
            detailPlaceholder="Descreva a cirurgia realizada..."
          />

          <ConditionalYesNoField
            label="Pratica algum esporte?"
            value={data.praticaEsporte}
            onChange={(v) => set("praticaEsporte", v)}
            name="esporte"
            detailLabel="Qual esporte?"
            detailValue={data.praticaEsporteQual}
            onDetailChange={(v) => set("praticaEsporteQual", v)}
            detailPlaceholder="Ex: corrida, futebol, natação..."
          />

          <ConditionalYesNoField
            label="Toma algum medicamento?"
            value={data.tomaMedicamento}
            onChange={(v) => set("tomaMedicamento", v)}
            name="medicamento"
            detailLabel="Qual medicamento?"
            detailValue={data.tomaMedicamentoQual}
            onDetailChange={(v) => set("tomaMedicamentoQual", v)}
            detailPlaceholder="Liste os medicamentos..."
          />

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
            <Footprints className="h-5 w-5 text-primary" />
            Hábitos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <OptionsField
            label="Tipo de calçado que mais usa"
            value={data.tipoCalcado}
            onChange={(v) => set("tipoCalcado", v)}
            name="calcado"
            options={[
              { value: "aberto", label: "Aberto" },
              { value: "fechado", label: "Fechado" },
              { value: "salto", label: "Salto" },
              { value: "sapato_baixo", label: "Sapato baixo" },
            ]}
          />
          <OptionsField
            label="Tipo de meia que mais usa"
            value={data.tipoMeia}
            onChange={(v) => set("tipoMeia", v)}
            name="meia"
            options={[
              { value: "algodao", label: "Algodão" },
              { value: "nylon", label: "Nylon" },
            ]}
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
        <CardContent className="grid gap-5 md:grid-cols-2">
          <YesNoField
            label="Marca-passo ou pinos?"
            value={data.marcaPassosPinos}
            onChange={(v) => set("marcaPassosPinos", v)}
            name="marcapasso"
          />
          <YesNoField
            label="Problemas cancerígenos (teve ou tem)?"
            value={data.problemasCancerigenos}
            onChange={(v) => set("problemasCancerigenos", v)}
            name="cancer"
          />
          <YesNoField
            label="Pressão alta?"
            value={data.pressaoAlta}
            onChange={(v) => set("pressaoAlta", v)}
            name="pressao"
          />
          <YesNoField
            label="Diabetes?"
            value={data.diabetesCondicao}
            onChange={(v) => set("diabetesCondicao", v)}
            name="diabetes-cond"
          />
          <YesNoField
            label="Convulsões?"
            value={data.convulsoes}
            onChange={(v) => set("convulsoes", v)}
            name="convulsoes"
          />
          <YesNoField
            label="Problemas circulatórios?"
            value={data.problemasCirculatorios}
            onChange={(v) => set("problemasCirculatorios", v)}
            name="circulatorios"
          />
          <YesNoField
            label="Alergia?"
            value={data.alergia}
            onChange={(v) => set("alergia", v)}
            name="alergia-cond"
          />
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
