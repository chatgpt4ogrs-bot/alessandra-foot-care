import { AppSidebar } from "@/components/app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal com sidebar fixo à esquerda (full-height) e
 * área de conteúdo deslocada para a direita.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      {/* Desloca o conteúdo para não ficar atrás do sidebar (w-60 = 240px) */}
      <div className="pl-60">
        <main className="min-h-screen animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
