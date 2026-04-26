import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Minus,
  Package,
  Pencil,
  Plus,
  Trash2,
  Wallet,
  TrendingUp,
  Boxes,
} from "lucide-react";
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
  formatBRL,
  isLowStock,
  updateProduct,
  type Product,
  type ProductInput,
} from "@/lib/products";

/* ----------------------- linha de produto memoizada ----------------------- */

interface RowProps {
  product: Product;
  onAdjust: (p: Product, delta: number, step: number) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

const ProductRow = memo(function ProductRow({
  product: p,
  onAdjust,
  onEdit,
  onDelete,
}: RowProps) {
  const [stepValue, setStepValue] = useState("");
  const low = isLowStock(p);

  const step = useMemo(() => {
    if (!stepValue.trim()) return 1;
    const n = Math.abs(Number(stepValue));
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [stepValue]);

  return (
    <Card
      className={`p-4 flex items-center gap-4 flex-wrap ${
        low ? "border-destructive/40 bg-destructive/5" : ""
      }`}
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
            className={`font-medium tabular-nums ${
              low ? "text-destructive" : "text-foreground"
            }`}
          >
            {p.quantidade}
          </span>{" "}
          · Mínimo: {p.quantidadeMinima}
        </p>
        {(p.precoCusto > 0 || p.precoVenda > 0) && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Custo un.{" "}
              <span className="tabular-nums font-medium text-foreground">
                {formatBRL(p.precoCusto)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Cobrado/uso{" "}
              <span className="tabular-nums font-medium text-foreground">
                {formatBRL(p.precoVenda)}
              </span>
            </span>
            {p.precoCusto > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                Total em estoque{" "}
                <span className="tabular-nums font-semibold">
                  {formatBRL(p.precoCusto * p.quantidade)}
                </span>
              </span>
            )}
          </div>
        )}
        {p.observacao && (
          <p className="text-xs text-muted-foreground mt-2">{p.observacao}</p>
        )}
      </div>
      <div className="flex items-center gap-1 rounded-md border border-input bg-background p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAdjust(p, -1, step)}
          aria-label="Retirar do estoque"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <Input
          type="number"
          min={1}
          value={stepValue}
          onChange={(e) => setStepValue(e.target.value)}
          placeholder="1"
          className="h-7 w-14 text-center text-sm border-0 shadow-none focus-visible:ring-0 px-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAdjust(p, 1, step)}
          aria-label="Adicionar ao estoque"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(p)}
          className="gap-1"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(p)}
          className="gap-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Excluir
        </Button>
      </div>
    </Card>
  );
});

/* ------------------------------- view raiz ------------------------------- */

export function StockView() {
  const { products, loaded } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const alertedRef = useRef<Set<string>>(new Set());

  // Estado local "espelho" para atualização otimista instantânea
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const sorted = useMemo(() => {
    return [...localProducts].sort((a, b) => {
      const aLow = isLowStock(a) ? 0 : 1;
      const bLow = isLowStock(b) ? 0 : 1;
      if (aLow !== bLow) return aLow - bLow;
      return a.quantidade - b.quantidade;
    });
  }, [localProducts]);

  const totals = useMemo(() => {
    let totalUnidades = 0;
    let valorInvestido = 0;
    let potencialReceita = 0;
    for (const p of localProducts) {
      totalUnidades += p.quantidade;
      valorInvestido += p.precoCusto * p.quantidade;
      potencialReceita += p.precoVenda * p.quantidade;
    }
    return { totalUnidades, valorInvestido, potencialReceita };
  }, [localProducts]);

  // Alerta automático de estoque baixo (sem causar re-render)
  useEffect(() => {
    if (!loaded) return;
    localProducts.forEach((p) => {
      if (isLowStock(p)) {
        if (!alertedRef.current.has(p.id)) {
          alertedRef.current.add(p.id);
          toast.warning(`⚠️ Atenção: ${p.nome} está com estoque baixo`, {
            description: `Quantidade atual: ${p.quantidade} (mínimo: ${p.quantidadeMinima})`,
            duration: 5000,
          });
        }
      } else {
        alertedRef.current.delete(p.id);
      }
    });
  }, [localProducts, loaded]);

  const handleAdjust = useCallback(
    (p: Product, delta: number, step: number) => {
      const change = delta > 0 ? step : -step;
      const newQty = p.quantidade + change;
      if (newQty < 0) {
        toast.error("Quantidade insuficiente em estoque");
        return;
      }
      // Atualização otimista — UI responde imediatamente
      setLocalProducts((prev) =>
        prev.map((it) => (it.id === p.id ? { ...it, quantidade: newQty } : it)),
      );
      // Persiste em background
      updateProduct(p.id, {
        nome: p.nome,
        quantidade: newQty,
        quantidadeMinima: p.quantidadeMinima,
        observacao: p.observacao,
        precoCusto: p.precoCusto,
        precoVenda: p.precoVenda,
      }).catch((err) => {
        console.error("[stock] update failed", err);
        toast.error("Falha ao salvar. Recarregando...");
        // Reverte em caso de erro
        setLocalProducts((prev) =>
          prev.map((it) =>
            it.id === p.id ? { ...it, quantidade: p.quantidade } : it,
          ),
        );
      });
    },
    [],
  );

  const openNew = useCallback(() => {
    setEditing(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((p: Product) => {
    setEditing(p);
    setForm({
      nome: p.nome,
      quantidade: p.quantidade,
      quantidadeMinima: p.quantidadeMinima,
      observacao: p.observacao,
      precoCusto: p.precoCusto,
      precoVenda: p.precoVenda,
    });
    setDialogOpen(true);
  }, []);

  const askDelete = useCallback((p: Product) => {
    setConfirmDelete(p);
  }, []);

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
              ? `${localProducts.length} ${localProducts.length === 1 ? "produto cadastrado" : "produtos cadastrados"}.`
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precoCusto">Preço de custo (R$)</Label>
                  <Input
                    id="precoCusto"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0,00"
                    value={form.precoCusto || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        precoCusto: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Quanto você gastou por unidade
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precoVenda">Valor cobrado por uso (R$)</Label>
                  <Input
                    id="precoVenda"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0,00"
                    value={form.precoVenda || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        precoVenda: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Quanto você cobra cada vez que aplica no paciente
                  </p>
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

      {loaded && localProducts.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Boxes className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Itens em estoque</p>
              <p className="font-serif text-2xl tabular-nums text-foreground">
                {totals.totalUnidades}
              </p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3 border-primary/20 bg-primary/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Total investido em estoque
              </p>
              <p className="font-serif text-2xl tabular-nums text-foreground">
                {formatBRL(totals.valorInvestido)}
              </p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Receita potencial (se usar tudo)
              </p>
              <p className="font-serif text-2xl tabular-nums text-foreground">
                {formatBRL(totals.potencialReceita)}
              </p>
            </div>
          </Card>
        </div>
      )}

      {loaded && localProducts.length === 0 ? (
        <Card className="p-10 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhum produto cadastrado ainda.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onAdjust={handleAdjust}
              onEdit={openEdit}
              onDelete={askDelete}
            />
          ))}
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
