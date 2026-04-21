import { useEffect, useState } from "react";
import { getAllProducts, type Product } from "@/lib/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProducts(getAllProducts());
    setLoaded(true);
    const handler = () => setProducts(getAllProducts());
    window.addEventListener("products-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("products-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { products, loaded };
}
