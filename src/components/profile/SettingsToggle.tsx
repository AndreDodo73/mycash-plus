type SettingsToggleProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  badge?: string;
};

export function SettingsToggle({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  badge,
}: SettingsToggleProps) {
  return (
    <div className="flex min-h-12 w-full items-center justify-between gap-space-16">
      <div className="flex min-w-0 flex-1 items-center gap-space-8">
        <label
          htmlFor={id}
          className={[
            "min-w-0 text-label-medium tracking-[0.3px]",
            disabled ? "text-neutral-500" : "text-neutral-1100",
          ].join(" ")}
        >
          {label}
        </label>
        {badge ? (
          <span className="shrink-0 rounded-shape-100 bg-neutral-200 px-space-8 py-space-2 text-label-small font-semibold tracking-[0.3px] text-neutral-600">
            {badge}
          </span>
        ) : null}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "motion-tap relative inline-flex h-8 w-12 shrink-0 items-center rounded-shape-100 transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-1100",
          disabled
            ? "cursor-not-allowed bg-neutral-300 opacity-70"
            : checked
              ? "bg-primary"
              : "bg-neutral-300 hover:bg-neutral-400",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={[
            "absolute top-1 size-6 rounded-shape-100 bg-surface shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
