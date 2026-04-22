import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Minus, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/use-products";
import {
  createProduct,
  deleteProduct,
  emptyProduct,
  isLowStock,
  updateProduct,
  type Product,
  type ProductInput,
} from "@/lib/products";

export function StockView() {
  const { products, loaded } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [alertedIds, setAlertedIds] = useState<Set<string>>(new Set());
  const [stepValues, setStepValues] = useState<Record<string, string>>({});
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());
  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  function flash(id: string) {
    setFlashIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (flashTimers.current[id]) clearTimeout(flashTimers.current[id]);
    flashTimers.current[id] = setTimeout(() => {
      setFlashIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 600);
  }

  function adjustStock(p: Product, delta: number) {
    const raw = stepValues[p.id];
    const step = raw && raw.trim() !== "" ? Math.abs(Number(raw)) || 1 : 1;
    const change = delta > 0 ? step : -step;
    const newQty = p.quantidade + change;
    if (newQty < 0) {
      toast.error("Quantidade insuficiente em estoque");
      return;
    }
    updateProduct(p.id, {
      nome: p.nome,
      quantidade: newQty,
      quantidadeMinima: p.quantidadeMinima,
      observacao: p.observacao,
    });
    flash(p.id);
    // Resetar alerta para que dispare novamente caso volte a ficar baixo
    if (newQty > p.quantidadeMinima) {
      setAlertedIds((prev) => {
        if (!prev.has(p.id)) return prev;
        const next = new Set(prev);
        next.delete(p.id);
        return next;
      });
    }
  }

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      const aLow = isLowStock(a) ? 0 : 1;
      const bLow = isLowStock(b) ? 0 : 1;
      if (aLow !== bLow) return aLow - bLow;
      return a.quantidade - b.quantidade;
    });
  }, [products]);

  // Alerta automático ao entrar na aba / quando produtos ficam baixos
  useEffect(() => {
    if (!loaded) return;
    const lows = products.filter(isLowStock);
    const newOnes = lows.filter((p) => !alertedIds.has(p.id));
    if (newOnes.length === 0) return;
    newOnes.forEach((p) => {
      toast.warning(`⚠️ Atenção: o produto ${p.nome} está com estoque baixo`, {
        description: `Quantidade atual: ${p.quantidade} (mínimo: ${p.quantidadeMinima})`,
        duration: 6000,
      });
    });
    setAlertedIds((prev) => {
      const next = new Set(prev);
      newOnes.forEach((p) => next.add(p.id));
      return next;
    });
  }, [products, loaded, alertedIds]);

  function openNew() {
    setEditing(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      nome: p.nome,
      quantidade: p.quantidade,
      quantidadeMinima: p.quantidadeMinima,
      observacao: p.observacao,
    });
    setDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) {
      toast.error("Informe o nome do produto");
      return;
    }
    if (editing) {
      updateProduct(editing.id, form);
      toast.success("Produto atualizado");
    } else {
      createProduct(form);
      toast.success("Produto cadastrado");
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!confirmDelete) return;
    deleteProduct(confirmDelete.id);
    toast.success("Produto excluído");
    setConfirmDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-3xl text-foreground">Estoque</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {loaded
              ? `${products.length} ${products.length === 1 ? "produto cadastrado" : "produtos cadastrados"}.`
              : "Carregando..."}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar produto" : "Cadastrar produto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do produto</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade atual</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min={0}
                    value={form.quantidade}
                    onChange={(e) =>
                      setForm({ ...form, quantidade: Number(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minima">Quantidade mínima</Label>
                  <Input
                    id="minima"
                    type="number"
                    min={0}
                    value={form.quantidadeMinima}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        quantidadeMinima: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="obs">Observação (opcional)</Label>
                <Textarea
                  id="obs"
                  value={form.observacao}
                  onChange={(e) =>
                    setForm({ ...form, observacao: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Salvar produto</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loaded && products.length === 0 ? (
        <Card className="p-10 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhum produto cadastrado ainda.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((p) => {
            const low = isLowStock(p);
            return (
              <Card
                key={p.id}
                className={`p-4 flex items-center gap-4 flex-wrap transition-all duration-300 ${
                  low ? "border-destructive/40 bg-destructive/5" : ""
                } ${flashIds.has(p.id) ? "ring-2 ring-primary/50 scale-[1.005]" : ""}`}
              >
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-foreground">{p.nome}</h3>
                    {low && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Estoque baixo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quantidade:{" "}
                    <span
                      key={p.quantidade}
                      className={`font-medium tabular-nums inline-block transition-all ${low ? "text-destructive" : "text-foreground"} ${flashIds.has(p.id) ? "scale-110" : ""}`}
                    >
                      {p.quantidade}
                    </span>{" "}
                    · Mínimo: {p.quantidadeMinima}
                  </p>
                  {p.observacao && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {p.observacao}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 rounded-md border border-input bg-background p-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => adjustStock(p, -1)}
                    aria-label="Retirar do estoque"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={stepValues[p.id] ?? ""}
                    onChange={(e) =>
                      setStepValues((prev) => ({ ...prev, [p.id]: e.target.value }))
                    }
                    placeholder="1"
                    className="h-7 w-14 text-center text-sm border-0 shadow-none focus-visible:ring-0 px-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => adjustStock(p, 1)}
                    aria-label="Adicionar ao estoque"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(p)}
                    className="gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDelete(p)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto{" "}
              <strong>{confirmDelete?.nome}</strong> será removido do estoque.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
