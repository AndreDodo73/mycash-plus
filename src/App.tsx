import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/layout";
import { AuthProvider, FinanceProvider } from "./contexts";
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

export default function App() {
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
