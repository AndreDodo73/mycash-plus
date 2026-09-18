type ChevronDirection = "left" | "right" | "up" | "down";

type ChevronIconProps = {
  direction?: ChevronDirection;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const ROTATION: Record<ChevronDirection, string> = {
  right: "0deg",
  left: "180deg",
  up: "-90deg",
  down: "90deg",
};

/**
 * Chevron em traço geométrico — stroke reto (butt/miter), nunca round.
 * O círculo fica no botão (`ChevronButton` / `rounded-full`), não no ícone.
 */
export function ChevronIcon({
  direction = "right",
  size = 16,
  className = "",
  strokeWidth = 1.75,
}: ChevronIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={["shrink-0", className].filter(Boolean).join(" ")}
      style={{ transform: `rotate(${ROTATION[direction]})` }}
      aria-hidden="true"
    >
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

type ChevronButtonProps = {
  direction: Exclude<ChevronDirection, "up" | "down">;
  onClick?: () => void;
  disabled?: boolean;
  label: string;
  className?: string;
  size?: number;
};

/** Botão circular de navegação com chevron de stroke reto. */
export function ChevronButton({
  direction,
  onClick,
  disabled = false,
  label,
  className = "",
  size = 16,
}: ChevronButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={[
        "motion-tap flex size-11 shrink-0 items-center justify-center rounded-full text-neutral-1100 transition-colors",
        "hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent",
        className,
      ].join(" ")}
    >
      <ChevronIcon direction={direction} size={size} />
    </button>
  );
}
