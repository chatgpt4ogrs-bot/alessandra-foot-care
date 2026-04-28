import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  observacao: string;
  precoCusto: number;
  precoVenda: number;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

let productsCache: Product[] | null = null;
let productsInflight: Promise<Product[]> | null = null;

export function getCachedProducts(): Product[] | null {
  return productsCache;
}

function setProductsCache(next: Product[]) {
  productsCache = next;
}

function notify() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("products-updated"));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(r: any): Product {
  return {
    id: r.id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    nome: r.nome,
    quantidade: r.quantidade ?? 0,
    quantidadeMinima: r.quantidade_minima ?? 0,
    observacao: r.observacao ?? "",
    precoCusto: Number(r.preco_custo ?? 0),
    precoVenda: Number(r.preco_venda ?? 0),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  if (productsInflight) return productsInflight;
  productsInflight = (async () => {
    const { data, error } = await supabase
      .from("estoque")
      .select(
        "id,created_at,updated_at,nome,quantidade,quantidade_minima,observacao,preco_custo,preco_venda",
      )
      .order("created_at", { ascending: false });
    productsInflight = null;
    if (error) {
      console.error(error);
      return productsCache ?? [];
    }
    const list = (data ?? []).map(rowToProduct);
    setProductsCache(list);
    return list;
  })();
  return productsInflight;
}

export async function createProduct(input: ProductInput): Promise<Product | null> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;
  const { data, error } = await supabase
    .from("estoque")
    .insert({
      user_id: userId,
      nome: input.nome,
      quantidade: input.quantidade,
      quantidade_minima: input.quantidadeMinima,
      observacao: input.observacao,
      preco_custo: input.precoCusto,
      preco_venda: input.precoVenda,
    })
    .select()
    .single();
  if (error || !data) {
    console.error(error);
    return null;
  }
  notify();
  return rowToProduct(data);
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("estoque")
    .update({
      nome: input.nome,
      quantidade: input.quantidade,
      quantidade_minima: input.quantidadeMinima,
      observacao: input.observacao,
      preco_custo: input.precoCusto,
      preco_venda: input.precoVenda,
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  notify();
  return rowToProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("estoque").delete().eq("id", id);
  if (error) console.error(error);
  notify();
}

export function isLowStock(p: Product) {
  return p.quantidade <= p.quantidadeMinima;
}

export const emptyProduct: ProductInput = {
  nome: "",
  quantidade: 0,
  quantidadeMinima: 0,
  observacao: "",
  precoCusto: 0,
  precoVenda: 0,
};

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}
