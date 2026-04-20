import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-alessandra.jpeg";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-card/60 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Alessandra Corsi Nascimento — Podóloga"
            className="h-14 w-auto object-contain"
          />
          <span className="sr-only">
            Alessandra Corsi Nascimento — Podóloga
          </span>
        </Link>
      </div>
    </header>
  );
}
