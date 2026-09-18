import { useLocation, Outlet } from "react-router-dom";

/** Fade-in do conteúdo da rota ativa (200ms). Remonta em cada pathname. */
export function PageTransition() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="motion-page-enter w-full">
      <Outlet />
    </div>
  );
}
