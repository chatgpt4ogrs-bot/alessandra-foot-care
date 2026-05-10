import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
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
      <AppLayout>
        <div className="p-4 md:p-8">
          <StockView />
        </div>
      </AppLayout>
    </RequireAuth>
  );
}
