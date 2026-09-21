import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/layout";
import { AuthProvider, FinanceProvider } from "./contexts";
import { isSupabaseConfigured } from "./lib/supabase";
import {
  CardsPage,
  DashboardPage,
  GoalsPage,
  LoginPage,
  MotionLabPage,
  ProfilePage,
  RegisterPage,
  TransactionsPage,
} from "./pages";

function MissingSupabaseConfig() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-background px-space-16 py-space-32">
      <section className="flex w-full max-w-[480px] flex-col gap-space-16 rounded-shape-20 border border-red-600 bg-surface p-space-24">
        <h1 className="text-heading-small font-bold text-neutral-1100">
          Configuração incompleta
        </h1>
        <p className="text-paragraph-small text-neutral-700">
          As variáveis <code>VITE_SUPABASE_URL</code> e{" "}
          <code>VITE_SUPABASE_ANON_KEY</code> não estavam no build da Vercel.
          Elas já foram adicionadas — faça um novo deploy e recarregue esta
          página.
        </p>
      </section>
    </main>
  );
}

export default function App() {
  if (!isSupabaseConfigured) {
    return <MissingSupabaseConfig />;
  }

  return (
    <AuthProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/objetivos" element={<GoalsPage />} />
                <Route path="/cartoes" element={<CardsPage />} />
                <Route path="/transacoes" element={<TransactionsPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/lab" element={<MotionLabPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </FinanceProvider>
    </AuthProvider>
  );
}
