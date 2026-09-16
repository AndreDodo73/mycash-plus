import type { ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { APP_NAME } from "../../constants";
import { APP_ROUTES } from "../../constants/routes";
import { useIsDesktop } from "../../hooks";
import { Sidebar } from "./Sidebar";

function PlaceholderHeader() {
  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-between gap-space-12 border-b border-neutral-300 bg-surface px-space-16 py-space-12">
      <p className="shrink-0 text-label-large font-semibold text-neutral-1100">
        {APP_NAME}
      </p>
      <nav
        className="flex min-w-0 gap-space-8 overflow-x-auto"
        aria-label="Principal"
      >
        {APP_ROUTES.map((route) => (
          <NavLink
            key={route.id}
            to={route.path}
            end={route.path === "/"}
            className={({ isActive }) =>
              [
                "shrink-0 rounded-shape-100 px-space-12 py-space-12 text-label-x-small font-semibold",
                isActive ? "bg-primary text-neutral-1100" : "text-neutral-600",
              ].join(" ")
            }
          >
            {route.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export function AppShell({ children }: { children?: ReactNode }) {
  const isDesktop = useIsDesktop();

  return (
    <div
      className={
        isDesktop
          ? "flex min-h-dvh w-full flex-row bg-background"
          : "flex min-h-dvh w-full flex-col bg-background"
      }
    >
      {isDesktop ? <Sidebar /> : <PlaceholderHeader />}
      <main className="min-w-0 w-full flex-1 px-space-16 py-space-24 transition-[margin] duration-300 ease-in-out md:px-space-24 xl:px-space-32">
        <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px]">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
