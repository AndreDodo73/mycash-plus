import { NavLink } from "react-router-dom";
import iconCross from "../../assets/sidebar/icon-cross.svg";
import { APP_ROUTES } from "../../constants/routes";
import { SidebarIcon } from "./SidebarIcon";

type MenuDropdownProps = {
  onClose: () => void;
};

export function MenuDropdown({ onClose }: MenuDropdownProps) {
  return (
    <div
      className="w-full border-b border-neutral-300 bg-surface px-space-16 pt-space-8 pb-space-24 shadow-sm"
      role="dialog"
      aria-label="Menu de navegação"
    >
      <div className="mb-space-8 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="flex size-space-56 items-center justify-center rounded-shape-100"
          aria-label="Fechar menu"
        >
          <img
            src={iconCross}
            alt=""
            width={24}
            height={24}
            className="size-space-24"
            aria-hidden="true"
          />
        </button>
      </div>

      <nav className="flex flex-col gap-space-8" aria-label="Principal">
        {APP_ROUTES.map((route) => (
          <NavLink
            key={route.id}
            to={route.path}
            end={route.path === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              [
                "flex min-h-space-56 items-center gap-space-12 rounded-shape-100 px-space-16 py-space-12 text-label-large font-semibold",
                isActive
                  ? "bg-secondary text-surface [&_img]:brightness-0 [&_img]:invert"
                  : "bg-transparent text-neutral-600",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <SidebarIcon name={route.icon} label={route.label} />
                <span className={isActive ? "text-surface" : undefined}>
                  {route.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onClose}
        className="mt-space-24 flex min-h-space-56 w-full items-center justify-center rounded-shape-100 bg-red-600 px-space-16 text-label-large font-semibold text-surface"
      >
        Sair
      </button>
    </div>
  );
}
