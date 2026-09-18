import iconDollar from "../../assets/dashboard/icon-dollar.svg";
import iconEnvelope from "../../assets/profile/icon-envelope.svg";
import { useFinance } from "../../hooks";
import { formatCurrency } from "../../utils/formatCurrency";
import type { FamilyMember } from "../../types/finance";

type ProfileInfoTabProps = {
  user: FamilyMember;
  onEditUser: () => void;
  onEditMember: (memberId: string) => void;
  onAddMember: () => void;
};

export function ProfileInfoTab({
  user,
  onEditUser,
  onEditMember,
  onAddMember,
}: ProfileInfoTabProps) {
  const { familyMembers } = useFinance();
  const onlySelf = familyMembers.length <= 1;

  return (
    <div className="flex w-full flex-col gap-space-24">
      <article className="flex w-full flex-col items-center gap-space-24 rounded-shape-20 border border-neutral-300 bg-surface p-space-24 md:flex-row md:items-start md:p-space-32">
        <img
          src={user.avatarUrl}
          alt=""
          width={120}
          height={120}
          className="h-[var(--size-72)] w-[var(--size-72)] shrink-0 rounded-shape-100 object-cover md:h-32 md:w-32"
        />

        <div className="flex min-w-0 w-full flex-1 flex-col items-center gap-space-8 text-center md:items-start md:text-left">
          <h2 className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium">
            {user.name}
          </h2>
          <p className="text-label-medium tracking-[0.3px] text-neutral-600">
            {user.role}
          </p>

          {user.email ? (
            <p className="flex max-w-full items-center gap-space-8 text-paragraph-small tracking-[0.3px] text-neutral-600">
              <img
                src={iconEnvelope}
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
              />
              <span className="min-w-0 truncate">{user.email}</span>
            </p>
          ) : null}

          <p className="flex items-center gap-space-8 text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
            <img
              src={iconDollar}
              alt=""
              width={24}
              height={24}
              className="size-space-24"
              aria-hidden="true"
            />
            {formatCurrency(user.monthlyIncome ?? 0)}
            <span className="text-label-small font-normal text-neutral-600">
              / mês
            </span>
          </p>

          <button
            type="button"
            onClick={onEditUser}
            className="mt-space-8 flex min-h-12 items-center justify-center rounded-shape-100 border border-neutral-1100 px-space-24 text-label-medium font-semibold tracking-[0.3px] text-neutral-1100"
          >
            Editar Perfil
          </button>
        </div>
      </article>

      <section className="flex w-full flex-col gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
        <h3 className="text-heading-x-small font-bold text-neutral-1100">
          Membros da Família
        </h3>

        {onlySelf ? (
          <div className="flex flex-col items-center gap-space-16 rounded-shape-20 bg-neutral-100 px-space-16 py-space-32 text-center">
            <p className="text-paragraph-small text-neutral-600">
              Adicione outros membros para acompanhar as finanças em família.
            </p>
            <button
              type="button"
              onClick={onAddMember}
              className="flex min-h-12 items-center justify-center rounded-shape-100 bg-secondary px-space-24 text-label-medium font-semibold text-surface"
            >
              Adicionar Membro da Família
            </button>
          </div>
        ) : (
          <ul className="flex w-full flex-col gap-space-8">
            {familyMembers.map((member) => (
              <li key={member.id}>
                <button
                  type="button"
                  aria-label={`Editar ${member.name}`}
                  onClick={() => onEditMember(member.id)}
                  className="flex min-h-14 w-full min-w-0 items-center gap-space-12 rounded-shape-20 bg-neutral-100 px-space-16 py-space-12 text-left transition-colors hover:bg-neutral-200"
                >
                  <img
                    src={member.avatarUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-shape-100 object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-label-medium font-semibold tracking-[0.3px] text-neutral-1100">
                      {member.name}
                    </span>
                    <span className="block truncate text-label-small tracking-[0.3px] text-neutral-600">
                      {member.role}
                    </span>
                  </span>
                  <span className="shrink-0 text-label-medium font-semibold tabular-nums text-neutral-1100">
                    {formatCurrency(member.monthlyIncome ?? 0)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
