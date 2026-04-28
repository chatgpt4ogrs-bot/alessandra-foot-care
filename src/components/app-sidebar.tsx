import { Link, useNavigate } from "@tanstack/react-router";
import { Home, Users, CalendarDays, Package, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-alessandra-transparent.png";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const items = [
  { to: "/" as const, label: "Início", icon: Home },
  { to: "/pacientes" as const, label: "Pacientes", icon: Users },
  { to: "/agenda" as const, label: "Agenda", icon: CalendarDays },
  { to: "/estoque" as const, label: "Estoque", icon: Package },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    toast.success("Sessão encerrada.");
    navigate({ to: "/auth" });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-white border-r border-border/40 shadow-sm">
      {/* Logo */}
      <div className="flex items-center px-4 py-5 border-b border-border/30">
        <Link to="/" className="block">
          <img
            src={logo}
            alt="Alessandra Podóloga"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Menu
        </p>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: true }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/10 hover:text-foreground",
                  )}
                  activeProps={{
                    className:
                      "bg-primary/10 text-primary shadow-sm hover:bg-primary/15 hover:text-primary",
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer — usuário + logout */}
      {user && (
        <div className="border-t border-border/30 px-4 py-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
