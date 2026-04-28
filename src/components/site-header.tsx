import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import logo from "@/assets/logo-alessandra-transparent.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    toast.success("Sessão encerrada.");
    navigate({ to: "/auth" });
  }

  return (
    <header className="border-b border-border/30 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="block">
          <img
            src={logo}
            alt="Alessandra Podóloga — Gestão de pacientes"
            className="h-14 md:h-16 w-auto object-contain"
          />
          <span className="sr-only">Alessandra Podóloga — Gestão de pacientes</span>
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[200px]">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
