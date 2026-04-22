import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Entrar — Alessandra Podóloga" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: "/" });
    }
  }, [session, loading, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Informe email e senha.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error("Email ou senha incorretos");
          return;
        }
        toast.success("Bem-vinda!");
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Conta criada! Você já pode entrar.");
        setMode("signin");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-foreground">Alessandra Podóloga</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sistema de gestão de pacientes
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting
                  ? "Aguarde..."
                  : mode === "signin"
                    ? "Entrar"
                    : "Criar conta"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-sm text-primary hover:underline"
              >
                {mode === "signin"
                  ? "Não tem conta? Criar agora"
                  : "Já tem conta? Entrar"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
