import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logoDefault from "../assets/sidebar/logo-default.svg";
import { PasswordField } from "../components/auth/PasswordField";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível entrar.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-background px-space-16 py-space-32">
      <section className="flex w-full max-w-[420px] flex-col gap-space-24 rounded-shape-20 border border-neutral-300 bg-surface p-space-24 md:p-space-32">
        <header className="flex flex-col items-center gap-space-12 text-center">
          <img
            src={logoDefault}
            alt="mycash+"
            className="h-10 w-auto"
          />
          <div className="flex flex-col gap-space-4">
            <h1 className="text-heading-small font-bold text-neutral-1100">
              Entrar
            </h1>
            <p className="text-paragraph-small text-neutral-600">
              Acesse sua conta para gerenciar as finanças da família.
            </p>
          </div>
        </header>

        <form className="flex w-full flex-col gap-space-16" onSubmit={handleSubmit}>
          <label className="flex w-full flex-col gap-space-8">
            <span className="text-label-medium font-semibold text-neutral-1100">
              E-mail
            </span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-12 w-full rounded-shape-100 border border-neutral-1100 bg-surface px-space-16 text-base text-neutral-1100 outline-none focus:border-primary"
              placeholder="voce@email.com"
            />
          </label>

          <PasswordField
            label="Senha"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />

          {error ? (
            <p
              role="alert"
              className="rounded-shape-20 border border-red-600 bg-red-600/10 px-space-16 py-space-12 text-paragraph-small text-red-700"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || isLoading}
            className="flex min-h-12 w-full items-center justify-center rounded-shape-100 bg-neutral-1100 px-space-24 text-label-large font-bold tracking-[0.3px] text-surface transition-opacity disabled:opacity-60"
          >
            {submitting ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="text-center text-paragraph-small text-neutral-600">
          Ainda não tem conta?{" "}
          <Link
            to="/cadastro"
            className="font-semibold text-neutral-1100 underline-offset-2 hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </section>
    </main>
  );
}
