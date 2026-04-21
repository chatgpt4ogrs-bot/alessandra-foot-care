import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-alessandra-inicial.png";

export function SiteHeader() {
  return (
    <header className="border-b border-border/30 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex justify-center">
        <Link to="/" className="block">
          <img
            src={logo}
            alt="Alessandra Podóloga — Gestão de pacientes"
            className="h-14 md:h-16 w-auto object-contain"
          />
          <span className="sr-only">Alessandra Podóloga — Gestão de pacientes</span>
        </Link>
      </div>
    </header>
  );
}



