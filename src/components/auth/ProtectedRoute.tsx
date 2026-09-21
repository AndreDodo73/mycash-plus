import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/** Exige sessão Supabase. Sem login → /login. */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-background px-space-16">
        <p className="text-paragraph-medium text-neutral-600">Carregando…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
