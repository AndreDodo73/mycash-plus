import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logoDefault from "../assets/sidebar/logo-default.svg";
import { useAuth } from "../contexts/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      const result = await signUp(name, email, password);
      if (result.needsEmailConfirmation) {
        setInfo(
          "Conta criada. Se a confirmação de e-mail estiver ativa no Supabase, abra o link enviado e depois faça login.",
        );
        return;
      }
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível criar a conta.";
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
              Criar conta
            </h1>
            <p className="text-paragraph-small text-neutral-600">
              Cadastre-se para começar a usar o mycash+.
            </p>
          </div>
        </header>

        <form className="flex w-full flex-col gap-space-16" onSubmit={handleSubmit}>
          <label className="flex w-full flex-col gap-space-8">
            <span className="text-label-medium font-semibold text-neutral-1100">
              Nome
            </span>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-12 w-full rounded-shape-100 border border-neutral-1100 bg-surface px-space-16 text-base text-neutral-1100 outline-none focus:border-primary"
              placeholder="Seu nome"
            />
          </label>

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

          <label className="flex w-full flex-col gap-space-8">
            <span className="text-label-medium font-semibold text-neutral-1100">
              Senha
            </span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-12 w-full rounded-shape-100 border border-neutral-1100 bg-surface px-space-16 text-base text-neutral-1100 outline-none focus:border-primary"
              placeholder="Mínimo 6 caracteres"
            />
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-shape-20 border border-red-600 bg-red-600/10 px-space-16 py-space-12 text-paragraph-small text-red-700"
            >
              {error}
            </p>
          ) : null}

          {info ? (
            <p
              role="status"
              className="rounded-shape-20 border border-primary bg-primary/20 px-space-16 py-space-12 text-paragraph-small text-neutral-1100"
            >
              {info}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || isLoading}
            className="flex min-h-12 w-full items-center justify-center rounded-shape-100 bg-neutral-1100 px-space-24 text-label-large font-bold tracking-[0.3px] text-surface transition-opacity disabled:opacity-60"
          >
            {submitting ? "Criando…" : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-paragraph-small text-neutral-600">
          Já tem conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-neutral-1100 underline-offset-2 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
