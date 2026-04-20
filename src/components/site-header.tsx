import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-alessandra.png";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-card/60 backdrop-blur rounded-sm">
      <div className="mx-auto max-w-5xl px-4 py-6 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Alessandra Corsi — Podóloga"
            className="h-36 md:h-44 w-auto object-contain drop-shadow-sm"
          />
          <span className="sr-only">Alessandra Corsi — Podóloga</span>
        </Link>
      </div>
    </header>
  );
}
