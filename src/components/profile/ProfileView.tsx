import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconLogout from "../../assets/profile/icon-logout.svg";
import { useFinance } from "../../hooks";
import { ProfileInfoTab } from "./ProfileInfoTab";

type ProfileTab = "info" | "settings";

type ProfileViewProps = {
  onEditMember: (memberId: string) => void;
  onAddMember: () => void;
};

export function ProfileView({ onEditMember, onAddMember }: ProfileViewProps) {
  const navigate = useNavigate();
  const {
    familyMembers,
    setSelectedMember,
    setSearchText,
    setTransactionType,
  } = useFinance();
  const [tab, setTab] = useState<ProfileTab>("info");

  const user = familyMembers[0];

  function handleLogout() {
    setSelectedMember(null);
    setSearchText("");
    setTransactionType("all");
    navigate("/");
  }

  if (!user) {
    return (
      <section className="flex w-full flex-col gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
        <h1 className="text-heading-small font-bold text-neutral-1100">
          Perfil
        </h1>
        <p className="text-paragraph-small text-neutral-600">
          Nenhum membro cadastrado.
        </p>
        <button
          type="button"
          onClick={onAddMember}
          className="flex min-h-12 w-fit items-center justify-center rounded-shape-100 bg-secondary px-space-24 text-label-medium font-semibold text-surface"
        >
          Adicionar Membro da Família
        </button>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col gap-space-24">
      <header className="flex w-full flex-col gap-space-16">
        <h1 className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium">
          Perfil
        </h1>

        <div
          className="flex w-full gap-space-8 border-b border-neutral-300"
          role="tablist"
          aria-label="Abas do perfil"
        >
          <button
            type="button"
            role="tab"
            id="profile-tab-info"
            aria-controls="profile-panel-info"
            aria-selected={tab === "info"}
            className={[
              "flex min-h-12 items-center px-space-16 text-label-medium font-semibold tracking-[0.3px]",
              tab === "info"
                ? "border-b-2 border-neutral-1100 text-neutral-1100"
                : "border-b-2 border-transparent text-neutral-600",
            ].join(" ")}
            onClick={() => setTab("info")}
          >
            Informações
          </button>
          <button
            type="button"
            role="tab"
            id="profile-tab-settings"
            aria-controls="profile-panel-settings"
            aria-selected={tab === "settings"}
            className={[
              "flex min-h-12 items-center px-space-16 text-label-medium font-semibold tracking-[0.3px]",
              tab === "settings"
                ? "border-b-2 border-neutral-1100 text-neutral-1100"
                : "border-b-2 border-transparent text-neutral-600",
            ].join(" ")}
            onClick={() => setTab("settings")}
          >
            Configurações
          </button>
        </div>
      </header>

      {tab === "info" ? (
        <div
          id="profile-panel-info"
          role="tabpanel"
          aria-labelledby="profile-tab-info"
        >
          <ProfileInfoTab
            user={user}
            onEditUser={() => onEditMember(user.id)}
            onEditMember={onEditMember}
            onAddMember={onAddMember}
          />
        </div>
      ) : (
        <div
          id="profile-panel-settings"
          role="tabpanel"
          aria-labelledby="profile-tab-settings"
          className="rounded-shape-20 border border-neutral-300 bg-surface p-space-24"
        >
          <p className="text-paragraph-small text-neutral-600">
            O conteúdo desta aba entra no Prompt 20.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="flex min-h-12 w-full items-center justify-center gap-space-8 rounded-shape-100 bg-red-600 px-space-24 text-label-medium font-semibold text-surface transition-colors hover:bg-red-700 md:w-auto"
      >
        <img
          src={iconLogout}
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
        />
        Sair
      </button>
    </section>
  );
}
