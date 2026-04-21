import logo from "@/assets/logo-alessandra-transparent.png";

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border/30 mt-12">
      <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col items-center gap-3">
        <img
          src={logo}
          alt="Alessandra Corsi — Podóloga"
          className="h-24 w-auto object-contain mix-blend-multiply dark:mix-blend-normal"
        />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Alessandra Corsi — Podóloga
        </p>
      </div>
    </footer>
  );
}
