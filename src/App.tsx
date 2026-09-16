import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout";
import { FinanceProvider } from "./contexts";
import {
  CardsPage,
  DashboardPage,
  GoalsPage,
  MotionLabPage,
  ProfilePage,
  TransactionsPage,
} from "./pages";

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/objetivos" element={<GoalsPage />} />
            <Route path="/cartoes" element={<CardsPage />} />
            <Route path="/transacoes" element={<TransactionsPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/lab" element={<MotionLabPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}
