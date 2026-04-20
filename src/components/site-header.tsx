import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-alessandra.png";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-card/60 backdrop-blur rounded-sm">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Alessandra Corsi — Podóloga"
            className="h-24 md:h-28 w-auto object-contain"
          />
          <span className="sr-only">Alessandra Corsi — Podóloga</span>
        </Link>
      </div>
    </header>
  );
}
