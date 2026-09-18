import iconPlus from "../../assets/cards/icon-plus-line.svg";

type AddEntityTileProps = {
  label: string;
  onClick: () => void;
};

export function AddEntityTile({ label, onClick }: AddEntityTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full min-h-40 w-full items-center justify-center gap-space-8 rounded-shape-20 border border-neutral-1100 bg-surface px-space-16 py-space-24 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
    >
      <img
        src={iconPlus}
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
      />
      {label}
    </button>
  );
}
