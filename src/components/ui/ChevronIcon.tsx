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

/** Seta tipo Airbnb: chevron fino em traço, sem círculo embutido. */
export function ChevronIcon({
  direction = "right",
  size = 16,
  className = "",
  strokeWidth = 1.5,
}: ChevronIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${ROTATION[direction]})` }}
      aria-hidden="true"
    >
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
