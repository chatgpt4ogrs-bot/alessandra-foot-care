import { Link } from "@tanstack/react-router";
import { Flower2 } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-card/60 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-5 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
            <Flower2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-xl tracking-tight text-foreground leading-none">
              Alessandra Podóloga
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Gestão de pacientes
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
