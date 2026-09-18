type ModalCloseButtonProps = {
  onClick: () => void;
  label?: string;
  className?: string;
  iconSrc: string;
};

/**
 * Botão X dos modais — hover com fundo + rotação leve do ícone.
 */
export function ModalCloseButton({
  onClick,
  label = "Fechar",
  className = "",
  iconSrc,
}: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "motion-icon-btn motion-icon-btn--close motion-tap flex size-12 shrink-0 items-center justify-center rounded-shape-100",
        className,
      ].join(" ")}
    >
      <img
        src={iconSrc}
        alt=""
        width={24}
        height={24}
        className="motion-icon-btn__glyph size-space-24"
        aria-hidden="true"
      />
    </button>
  );
}
