import { useEffect, useState } from "react";
import { getAllProducts, type Product } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";

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
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      cancelled = true;
      window.removeEventListener("products-updated", handler);
      sub.subscription.unsubscribe();
    };
  }, []);

  return { products, loaded };
}
