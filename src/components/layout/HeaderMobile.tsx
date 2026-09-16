import { useEffect, useId, useState } from "react";
import avatarPlaceholder from "../../assets/sidebar/avatar-placeholder.png";
import logoDefault from "../../assets/sidebar/logo-default.svg";
import { APP_NAME, PLACEHOLDER_USER } from "../../constants";
import { MenuDropdown } from "./MenuDropdown";

export function HeaderMobile() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  function closeMenu() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="w-full shrink-0 self-stretch">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-secondary/50"
          aria-label="Fechar menu"
          onClick={closeMenu}
        />
      ) : null}

      <div className="sticky top-0 z-40 w-full bg-surface">
        <header className="flex w-full min-w-0 items-center justify-between border-b border-neutral-300 bg-surface px-space-16 py-space-12">
          <img
            src={logoDefault}
            alt={APP_NAME}
            width={112}
            height={24}
            className="h-space-24 w-[112px] shrink-0 object-contain object-left"
          />
          <button
            type="button"
            className="flex size-space-56 shrink-0 items-center justify-center rounded-shape-100"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={`Menu de ${PLACEHOLDER_USER.name}`}
            onClick={() => setOpen((current) => !current)}
          >
            <img
              src={avatarPlaceholder}
              alt=""
              width={32}
              height={32}
              className="size-space-32 rounded-shape-100 object-cover"
            />
          </button>
        </header>

        {open ? (
          <div id={menuId}>
            <MenuDropdown onClose={closeMenu} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
