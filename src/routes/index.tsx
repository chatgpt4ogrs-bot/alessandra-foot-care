import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { DashboardView } from "@/components/dashboard-view";
import { RequireAuth } from "@/components/require-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — Alessandra Podóloga" },
      {
        name: "description",
        content:
          "Painel inicial com resumo de pacientes, agenda e estoque para a rotina de podologia.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <RequireAuth>
      <AppLayout>
        <div className="px-8 py-8">
          <DashboardView />
        </div>
      </AppLayout>
    </RequireAuth>
  );
}
