export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  observacao: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

const STORAGE_KEY = "alessandra-podologa-products";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAllProducts(): Product[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Product[];
  } catch {
    return [];
  }
}

function save(products: Product[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("products-updated"));
}

export function createProduct(input: ProductInput): Product {
  const now = new Date().toISOString();
  const product: Product = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  save([product, ...getAllProducts()]);
  return product;
}

export function updateProduct(id: string, input: ProductInput): Product | null {
  const all = getAllProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated: Product = {
    ...all[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  save(all);
  return updated;
}

export function deleteProduct(id: string) {
  save(getAllProducts().filter((p) => p.id !== id));
}

export function isLowStock(p: Product) {
  return p.quantidade <= p.quantidadeMinima;
}

export const emptyProduct: ProductInput = {
  nome: "",
  quantidade: 0,
  quantidadeMinima: 0,
  observacao: "",
};
