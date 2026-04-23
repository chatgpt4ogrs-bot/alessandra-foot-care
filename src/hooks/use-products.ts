import { useEffect, useState } from "react";
import { getAllProducts, type Product } from "@/lib/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const all = await getAllProducts();
      if (!cancelled) {
        setProducts(all);
        setLoaded(true);
      }
    };
    load();
    const handler = () => load();
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
  }, []);

  return { products, loaded };
}
