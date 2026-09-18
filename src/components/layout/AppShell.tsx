import type { ReactNode } from "react";
import { useIsDesktop } from "../../hooks";
import { HeaderMobile } from "./HeaderMobile";
import { PageTransition } from "./PageTransition";
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
      <main className="min-w-0 w-full flex-1 overflow-x-hidden px-space-16 py-space-24 transition-[margin] duration-300 ease-in-out md:px-space-24 lg:px-space-32">
        <div className="mx-auto w-full max-w-[1400px] xl:max-w-[1600px]">
          {children ?? <PageTransition />}
        </div>
      </main>
    </div>
  );
}
