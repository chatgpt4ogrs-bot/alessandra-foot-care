import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

// ─── Helpers ─────────────────────────────────────────

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

import { z } from "zod";

const RegisterSchema = z
  .object({
    nome: z.string().trim().min(3, "Nome deve ter no mínimo 3 caracteres").max(255),
    email: z.string().trim().email("Email inválido").max(255),
    telefone: z
      .string()
      .trim()
      .refine((val) => val.replace(/\D/g, "").length >= 10, "Telefone inválido"),
    senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").max(255),
    confirmarSenha: z.string().max(255),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas diferentes",
    path: ["confirmarSenha"],
  });

type FormErrors = Partial<Record<keyof z.infer<typeof RegisterSchema>, string>>;

// ─── Component ───────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  function handleChange(field: string, value: string) {
    const val = field === "telefone" ? formatPhone(value) : value;
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  async function handleRegister() {
    setGlobalError("");
    setErrors({});

    const parsed = RegisterSchema.safeParse(form);
    if (!parsed.success) {
      const formattedErrors: FormErrors = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FormErrors;
        if (!formattedErrors[path]) {
          formattedErrors[path] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: {
          data: {
            nome: form.nome,
            telefone: form.telefone,
          },
        },
      });

      if (error) {
        setGlobalError(error.message);
        return;
      }

      if (data.user) {
        await supabase.from("usuarios").insert({
          id: data.user.id,
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
        });
      }

      setSuccess(true);
    } catch (err) {
      setGlobalError("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  // ─── Sucesso ───────────────────────────────────────

  if (success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Conta criada</h2>
          <p className="text-sm mt-2">Verifique seu email</p>

          <button
            onClick={() => router.navigate({ to: "/auth" })}
            className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
          >
            Ir para login
          </button>
        </div>
      </div>
    );
  }

  // ─── Form ──────────────────────────────────────────

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold mb-4">Criar conta</h1>

        {globalError && (
          <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">{globalError}</div>
        )}

        <div className="space-y-3">
          <div>
            <input
              placeholder="Nome"
              className="w-full px-4 py-3 border rounded outline-none focus:border-teal-500"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
            {errors.nome && <p className="text-red-500 text-xs">{errors.nome}</p>}
          </div>

          <div>
            <input
              placeholder="Email"
              className="w-full px-4 py-3 border rounded outline-none focus:border-teal-500"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div>
            <input
              placeholder="Telefone"
              className="w-full px-4 py-3 border rounded outline-none focus:border-teal-500"
              value={form.telefone}
              onChange={(e) => handleChange("telefone", e.target.value)}
            />
            {errors.telefone && <p className="text-red-500 text-xs">{errors.telefone}</p>}
          </div>

          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              placeholder="Senha"
              className="w-full px-4 py-3 border rounded outline-none focus:border-teal-500"
              value={form.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.senha && <p className="text-red-500 text-xs">{errors.senha}</p>}
          </div>

          <div className="relative">
            <input
              type={showConfirmar ? "text" : "password"}
              placeholder="Confirmar senha"
              className="w-full px-4 py-3 border rounded outline-none focus:border-teal-500"
              value={form.confirmarSenha}
              onChange={(e) => handleChange("confirmarSenha", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmar(!showConfirmar)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.confirmarSenha && (
              <p className="text-red-500 text-xs">{errors.confirmarSenha}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-md mt-4 font-medium"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <button
          onClick={() => router.navigate({ to: "/auth" })}
          className="w-full text-teal-600 text-sm hover:underline mt-2"
        >
          Já tenho uma conta
        </button>
      </div>
    </div>
  );
}
