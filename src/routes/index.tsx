import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
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
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-300">
            <AppSidebar />
            <div className="flex-1 min-w-0">
              <DashboardView />
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
