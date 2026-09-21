import { useFinance } from "../../hooks";
import { Avatar } from "../ui";

type FamilyAvatarsProps = {
  onAddMember: () => void;
};

export function FamilyAvatars({ onAddMember }: FamilyAvatarsProps) {
  const { familyMembers, selectedMember, setSelectedMember } = useFinance();

  return (
    <div className="flex items-center" aria-label="Membros da família">
      {familyMembers.map((member, index) => {
        const selected = selectedMember === member.id;
        return (
          <button
            key={member.id}
            type="button"
            title={`${member.name} — ${member.role}`}
            aria-pressed={selected}
            aria-label={`Filtrar por ${member.name}`}
            onClick={() => setSelectedMember(selected ? null : member.id)}
            className={[
              "motion-avatar relative size-11 shrink-0 overflow-visible rounded-shape-100",
              index > 0 ? "-ml-space-8" : "",
              selected ? "z-20 scale-110" : "hover:z-30 hover:scale-110",
            ].join(" ")}
            style={{ zIndex: selected ? 30 : 10 + index }}
          >
            <span
              className={[
                "block size-full overflow-hidden rounded-shape-100",
                selected ? "border-4 border-secondary" : "border-2 border-surface",
              ].join(" ")}
            >
              <Avatar
                src={member.avatarUrl}
                width={44}
                height={44}
                className="size-full object-cover"
              />
            </span>
            {selected ? (
              <span
                className="absolute -right-space-2 -bottom-space-2 flex size-space-16 items-center justify-center rounded-shape-100 bg-green-600 text-[10px] font-bold text-surface"
                aria-hidden="true"
              >
                ✓
              </span>
            ) : null}
          </button>
        );
      })}

      <button
        type="button"
        onClick={onAddMember}
        aria-label="Adicionar membro"
        className="-ml-space-8 flex size-11 shrink-0 items-center justify-center rounded-shape-100 border-2 border-surface bg-neutral-300 text-label-large font-semibold text-neutral-1100"
      >
        +
      </button>
    </div>
  );
}
