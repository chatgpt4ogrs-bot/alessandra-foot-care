import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SectionNav } from "@/components/section-nav";
import { StockView } from "@/components/stock-view";
import { RequireAuth } from "@/components/require-auth";

export const Route = createFileRoute("/estoque")({
  head: () => ({
    meta: [
      { title: "Estoque — Alessandra Podóloga" },
      {
        name: "description",
        content: "Controle de estoque de produtos utilizados nos atendimentos.",
      },
    ],
  }),
  component: EstoquePage,
});

function EstoquePage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <SectionNav />
        <main className="mx-auto max-w-5xl px-4 py-10 animate-in fade-in duration-300">
          <StockView />
        </main>
      </div>
    </RequireAuth>
  );
}
