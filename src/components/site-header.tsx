import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-alessandra-transparent.png";

export function SiteHeader() {
  return (
    <header className="border-b border-border/30 bg-card/60 backdrop-blur rounded-sm">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3 overflow-hidden">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Alessandra Corsi — Podóloga"
            className="h-20 md:h-24 w-auto object-contain scale-[2] origin-left drop-shadow-sm"
          />
          <span className="sr-only">Alessandra Corsi — Podóloga</span>
        </Link>
      </div>
    </header>
  );
}
