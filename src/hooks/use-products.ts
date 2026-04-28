import { useEffect, useState } from "react";
import { getAllProducts, getCachedProducts, type Product } from "@/lib/products";

let lastFetch = 0;
const STALE_MS = 30_000;

export function useProducts() {
  const cached = getCachedProducts();
  const [products, setProducts] = useState<Product[]>(cached ?? []);
  const [loaded, setLoaded] = useState(cached !== null);

  useEffect(() => {
    let cancelled = false;

    const load = async (force = false) => {
      const now = Date.now();
      if (!force && cached && now - lastFetch < STALE_MS) {
        return;
      }
      const all = await getAllProducts();
      lastFetch = Date.now();
      if (!cancelled) {
        setProducts(all);
        setLoaded(true);
      }
    };

    load();

    const handler = () => {
      const c = getCachedProducts();
      if (c) {
        setProducts(c);
        setLoaded(true);
      } else {
        load(true);
      }
    };
    window.addEventListener("products-updated", handler);

    const optimisticHandler = (e: Event) => {
      const detail = (e as CustomEvent<Product[]>).detail;
      if (detail && Array.isArray(detail)) setProducts(detail);
    };
    window.addEventListener("products-optimistic", optimisticHandler);

    return () => {
      cancelled = true;
      window.removeEventListener("products-updated", handler);
      window.removeEventListener("products-optimistic", optimisticHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loaded };
}
