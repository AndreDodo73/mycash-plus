import { useState } from "react";
import { NavLink } from "react-router-dom";
import avatarPlaceholder from "../../assets/sidebar/avatar-placeholder.png";
import iconChevron from "../../assets/sidebar/icon-chevron.svg";
import logoDefault from "../../assets/sidebar/logo-default.svg";
import logoSmall from "../../assets/sidebar/logo-small.svg";
import { APP_NAME, PLACEHOLDER_USER } from "../../constants";
import {
  SIDEBAR_WIDTH_COLLAPSED_PX,
  SIDEBAR_WIDTH_EXPANDED_PX,
} from "../../constants/breakpoints";
import { APP_ROUTES } from "../../constants/routes";
import { SidebarIcon } from "./SidebarIcon";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="relative sticky top-0 z-20 flex h-dvh shrink-0 flex-col justify-between overflow-visible border-r border-neutral-300 bg-surface py-space-32 transition-[width] duration-300 ease-in-out"
      style={{
        width: collapsed
          ? SIDEBAR_WIDTH_COLLAPSED_PX
          : SIDEBAR_WIDTH_EXPANDED_PX,
        maxWidth: "100%",
        paddingInline: collapsed
          ? "var(--spacing-space-12)"
          : "var(--spacing-space-32)",
      }}
      aria-label="Navegação principal"
    >
      <div
        className={
          collapsed
            ? "flex flex-col items-center gap-space-56"
            : "flex w-full flex-col items-start gap-space-56"
        }
      >
        <img
          src={collapsed ? logoSmall : logoDefault}
          alt={APP_NAME}
          width={collapsed ? 45 : 140}
          height={collapsed ? 43 : 30}
          className={
            collapsed
              ? "h-[43px] w-[45px] shrink-0 object-contain"
              : "h-[30px] w-[140px] shrink-0 object-contain"
          }
        />

        <nav
          className={
            collapsed
              ? "flex flex-col items-center gap-space-8"
              : "flex w-full flex-col items-start gap-space-8"
          }
          aria-label="Principal"
        >
          {APP_ROUTES.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              end={route.path === "/"}
              title={collapsed ? route.label : undefined}
              aria-label={collapsed ? route.label : undefined}
              className={({ isActive }) =>
                [
                  "group relative flex items-center gap-space-8 rounded-shape-100 px-space-16 py-space-12 font-semibold text-label-large text-neutral-1100",
                  collapsed ? "justify-center" : "w-full",
                  isActive ? "bg-primary" : "bg-transparent",
                ].join(" ")
              }
            >
              <SidebarIcon name={route.icon} label={route.label} />
              {!collapsed ? <span>{route.label}</span> : null}
              {collapsed ? (
                <span className="pointer-events-none absolute top-1/2 left-full z-30 ml-space-8 -translate-y-1/2 rounded-shape-100 bg-secondary px-space-12 py-space-8 text-label-x-small font-semibold whitespace-nowrap text-surface opacity-0 shadow-sm transition-opacity delay-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {route.label}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        className={
          collapsed
            ? "flex flex-col items-center gap-space-12"
            : "flex w-full flex-col items-start gap-space-12"
        }
      >
        <img
          src={avatarPlaceholder}
          alt=""
          width={24}
          height={24}
          className="size-space-24 shrink-0 rounded-shape-100 object-cover"
        />
        {!collapsed ? (
          <div className="flex min-w-0 flex-col gap-space-8">
            <p className="text-label-medium font-semibold text-neutral-1100">
              {PLACEHOLDER_USER.name}
            </p>
            <p className="text-paragraph-small text-neutral-1100">
              {PLACEHOLDER_USER.email}
            </p>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((open) => !open)}
        className="absolute top-[34px] right-[-12px] flex size-space-24 items-center justify-center rounded-shape-100 bg-surface p-space-4 shadow-sm"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        <img
          src={iconChevron}
          alt=""
          width={16}
          height={16}
          className={
            collapsed
              ? "size-space-16"
              : "size-space-16 rotate-180"
          }
          aria-hidden="true"
        />
      </button>
    </aside>
  );
}
