import { Link } from "@tanstack/react-router";
import { Home, Users, CalendarDays, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/" as const, label: "Início", icon: Home },
  { to: "/pacientes" as const, label: "Pacientes", icon: Users },
  { to: "/agenda" as const, label: "Agenda", icon: CalendarDays },
  { to: "/estoque" as const, label: "Estoque", icon: Package },
];

export function SectionNav() {
  return (
    <nav className="border-b border-border/40 bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4">
        <ul className="flex items-center gap-1 overflow-x-auto py-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: true }}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/10 hover:text-foreground",
                  )}
                  activeProps={{
                    className: "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
