import { Link } from "@tanstack/react-router";
import { Home, Users, CalendarDays, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/" as const, label: "Início", icon: Home },
  { to: "/pacientes" as const, label: "Pacientes", icon: Users },
  { to: "/agenda" as const, label: "Agenda", icon: CalendarDays },
  { to: "/estoque" as const, label: "Estoque", icon: Package },
];

export function AppSidebar() {
  return (
    <aside className="w-full md:w-60 shrink-0 md:sticky md:top-4 md:self-start">
      <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-3 shadow-sm">
        <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        <nav>
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
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
