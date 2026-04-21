import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-alessandra-inicial.png";

export function SiteHeader() {
  return (
    <header className="border-b border-border/30 bg-background rounded-sm">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center">
        <Link to="/" className="block">
          <img
            src={logo}
            alt="Alessandra Podóloga"
            className="h-20 md:h-24 w-auto object-contain"
          />
          <span className="sr-only">Alessandra Podóloga</span>
        </Link>
      </div>
    </header>
  );
}


