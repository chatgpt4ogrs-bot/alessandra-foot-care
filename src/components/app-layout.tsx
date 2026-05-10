import { AppSidebar, SidebarContent } from "@/components/app-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import logo from "@/assets/logo-alessandra-transparent.png";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal com sidebar fixo à esquerda (full-height) e
 * área de conteúdo deslocada para a direita, responsivo.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Desktop Sidebar - Hidden by CSS on screens smaller than lg */}
      <AppSidebar />

      {/* Mobile Top Header - Visível apenas em mobile/tablet (abaixo de lg) */}
      <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b sticky top-0 z-30 shadow-sm">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button 
              className="flex items-center justify-center p-2 text-muted-foreground hover:bg-accent rounded-md border border-border/50 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SidebarContent onClickItem={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        
        <Link to="/">
          <img src={logo} alt="Alessandra Podóloga" className="h-8 w-auto object-contain" />
        </Link>
      </header>

      {/* Main Content Area */}
      {/* 
          - lg:pl-64: No desktop, o conteúdo é empurrado pelo sidebar fixo.
          - pl-0: No mobile, o conteúdo ocupa 100% da largura.
      */}
      <div className="lg:pl-64 w-full min-w-0 transition-all duration-300">
        <main className="min-h-screen w-full animate-in fade-in duration-300 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
