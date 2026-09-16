import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { useIsDesktop } from "../../hooks";
import { HeaderMobile } from "./HeaderMobile";
import { Sidebar } from "./Sidebar";

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
      {isDesktop ? <Sidebar /> : <HeaderMobile />}
      <main className="min-w-0 w-full flex-1 px-space-16 py-space-24 transition-[margin] duration-300 ease-in-out md:px-space-24 xl:px-space-32">
        <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px]">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
