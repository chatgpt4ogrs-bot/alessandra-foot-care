import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Eye, Pencil, Search, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { usePatients } from "@/hooks/use-patients";
import { useDebounce } from "@/hooks/use-debounce";

export function PatientsList() {
  const { patients, loaded } = usePatients();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return patients;
    const q = debouncedQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.telefone.toLowerCase().includes(q),
    );
  }, [patients, debouncedQuery]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-foreground">Pacientes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {patients.length === 0
              ? "Nenhum paciente cadastrado ainda."
              : `${patients.length} paciente${patients.length > 1 ? "s" : ""} cadastrado${patients.length > 1 ? "s" : ""}.`}
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/novo">
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Paciente
          </Link>
        </Button>
      </div>

      {patients.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="pl-9 bg-card"
          />
        </div>
      )}

      {!loaded ? null : patients.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-accent/40 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">
              Comece cadastrando sua primeira paciente
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Os dados serão salvos com segurança neste navegador.
            </p>
            <Button asChild>
              <Link to="/novo">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Paciente
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Nenhuma paciente encontrada.
        </p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <Card key={p.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {p.nome}
                  </h3>
                  {p.telefone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3.5 w-3.5" />
                      {p.telefone}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/paciente/$id" params={{ id: p.id }}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/paciente/$id/editar" params={{ id: p.id }}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
