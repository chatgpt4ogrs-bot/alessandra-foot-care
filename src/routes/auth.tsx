import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: "/" });
    }
  }, [session, loading, navigate]);

  function describeError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes("invalid login credentials")) {
      return 'Email ou senha incorretos. Se ainda não tem conta, clique em "Criar agora".';
    }
    if (m.includes("email not confirmed")) {
      return "Email ainda não confirmado. Verifique sua caixa de entrada.";
    }
    if (m.includes("user already registered")) {
      return "Este email já está cadastrado. Faça login.";
    }
    if (m.includes("password should be at least")) {
      return "A senha precisa ter pelo menos 6 caracteres.";
    }
    if (m.includes("failed to fetch") || m.includes("network")) {
      return "Falha de conexão com o servidor. Verifique sua internet.";
    }
    return `Erro ao fazer login: ${message}`;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg("Informe email e senha.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          console.error("[auth] signIn error:", error);
          setErrorMsg(describeError(error.message));
          return;
        }
        console.log("[auth] signIn success:", data.user?.email);
        toast.success("Bem-vinda!");
        navigate({ to: "/" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) {
          console.error("[auth] signUp error:", error);
          setErrorMsg(describeError(error.message));
          return;
        }
        console.log("[auth] signUp success:", data.user?.email, "session:", !!data.session);
        if (data.session) {
          toast.success("Conta criada! Você já está logada.");
          navigate({ to: "/" });
        } else {
          toast.success("Conta criada! Você já pode entrar.");
          setMode("signin");
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("[auth] unexpected error:", err);
      }
      setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-foreground">Alessandra Podóloga</h1>
          <p className="text-sm text-muted-foreground mt-2">Sistema de gestão de pacientes</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={submitting}
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
                  disabled={submitting}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Aguarde...
                  </>
                ) : mode === "signin" ? (
                  "Entrar"
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setErrorMsg(null);
                }}
                className="text-sm text-primary hover:underline"
                disabled={submitting}
              >
                {mode === "signin" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
