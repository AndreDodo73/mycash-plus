import { useEffect, useId, useRef, useState } from "react";
import iconMore from "../../assets/cards/icon-more-vertical.svg";
import { MOTION, staggerStyle } from "../../constants/motion";
import { useFinance } from "../../hooks";
import type { BankAccount, FamilyMember } from "../../types/finance";
import { resolveBankLogo } from "../../utils/bankLogo";
import { formatCurrency } from "../../utils/formatCurrency";
import { Avatar } from "../ui";

type BankAccountOverviewCardProps = {
  account: BankAccount;
  holder?: FamilyMember;
  staggerIndex?: number;
};

function formatUpdatedLabel(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `Saldo atualizado ${day}/${month}/${year}`;
}

export function BankAccountOverviewCard({
  account,
  holder,
  staggerIndex = 0,
}: BankAccountOverviewCardProps) {
  const { deleteBankAccount } = useFinance();
  const logo = resolveBankLogo(account.name);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <article
      className="motion-enter-up motion-hover-lift relative flex h-full min-h-40 w-full flex-col justify-between gap-space-16 overflow-visible rounded-shape-20 border border-neutral-300 bg-surface p-space-24 hover:border-neutral-400"
      style={staggerStyle(staggerIndex, MOTION.stagger.gridMs)}
    >
      <div className="flex min-w-0 items-start justify-between gap-space-8">
        <div className="flex min-w-0 items-center gap-space-8">
          <span className="flex size-space-24 shrink-0 overflow-hidden rounded-shape-2">
            {logo ? (
              <img
                src={logo}
                alt=""
                width={24}
                height={24}
                className="size-full object-contain"
                aria-hidden="true"
              />
            ) : (
              <span
                className="size-full rounded-shape-2"
                style={{ backgroundColor: account.color }}
                aria-hidden="true"
              />
            )}
          </span>
          <h3 className="truncate text-label-medium font-normal tracking-[0.3px] text-neutral-1100">
            {account.name}
          </h3>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            className="motion-icon-btn motion-tap flex size-11 items-center justify-center rounded-full text-neutral-1100"
            aria-label={`Ações de ${account.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => {
              setConfirmDelete(false);
              setMenuOpen((open) => !open);
            }}
          >
            <img
              src={iconMore}
              alt=""
              width={24}
              height={24}
              className="size-space-24"
              aria-hidden="true"
            />
          </button>
          {menuOpen ? (
            <div
              id={menuId}
              role="menu"
              className="motion-dropdown absolute top-12 right-0 z-30 w-48 rounded-shape-20 border border-neutral-300 bg-surface p-space-8 shadow-md"
            >
              {confirmDelete ? (
                <div className="flex flex-col gap-space-4">
                  <p className="px-space-12 py-space-4 text-label-x-small text-neutral-600">
                    Excluir esta conta?
                  </p>
                  <div className="flex gap-space-4">
                    <button
                      type="button"
                      role="menuitem"
                      className="flex min-h-11 flex-1 items-center justify-center rounded-shape-100 border border-neutral-300 text-label-x-small font-semibold text-neutral-1100 hover:bg-neutral-100"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Não
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex min-h-11 flex-1 items-center justify-center rounded-shape-100 bg-red-600 text-label-x-small font-semibold text-surface hover:bg-red-700"
                      onClick={() => {
                        deleteBankAccount(account.id);
                        setConfirmDelete(false);
                        setMenuOpen(false);
                      }}
                    >
                      Sim
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  className="flex min-h-11 w-full items-center rounded-shape-20 px-space-12 text-left text-label-small font-semibold text-red-600 hover:bg-red-600/10"
                  onClick={() => setConfirmDelete(true)}
                >
                  Excluir
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-end justify-between gap-space-12">
        <div className="min-w-0">
          <p className="text-heading-medium font-bold text-neutral-1100 tabular-nums">
            {formatCurrency(account.balance)}
          </p>
          <p className="mt-space-4 text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
            {formatUpdatedLabel(new Date())}
          </p>
        </div>
        {holder ? (
          <span className="motion-avatar size-8 shrink-0 overflow-hidden rounded-full border border-neutral-300">
            <Avatar
              src={holder.avatarUrl}
              width={32}
              height={32}
              className="size-full object-cover"
            />
          </span>
        ) : (
          <span
            className="size-8 shrink-0 rounded-full border border-neutral-1100"
            aria-hidden="true"
          />
        )}
      </div>
    </article>
  );
}
