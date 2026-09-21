import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import iconLogout from "../../assets/profile/icon-logout.svg";
import { useAuth, useFinance } from "../../hooks";
import type { FamilyMember } from "../../types/finance";
import { ProfileInfoTab } from "./ProfileInfoTab";
import { ProfileSettingsTab } from "./ProfileSettingsTab";

type ProfileTab = "info" | "settings";

type ProfileViewProps = {
  onEditMember: (memberId: string) => void;
  onAddMember: () => void;
};

export function ProfileView({ onEditMember, onAddMember }: ProfileViewProps) {
  const navigate = useNavigate();
  const { signOut, profile, user: authUser } = useAuth();
  const { setSelectedMember, setSearchText, setTransactionType } = useFinance();
  const [tab, setTab] = useState<ProfileTab>("info");
  const [loggingOut, setLoggingOut] = useState(false);

  const accountUser = useMemo<FamilyMember>(() => {
    const name =
      profile?.name?.trim() ||
      (authUser?.user_metadata?.name as string | undefined)?.trim() ||
      authUser?.email?.split("@")[0] ||
      "Usuário";

    return {
      id: authUser?.id ?? "account",
      name,
      role: "Titular da conta",
      avatarUrl: profile?.avatarUrl ?? "",
      email: profile?.email || authUser?.email || undefined,
      monthlyIncome: 0,
    };
  }, [authUser, profile]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setSelectedMember(null);
    setSearchText("");
    setTransactionType("all");
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("[auth] logout", error);
      setLoggingOut(false);
    }
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
            user={accountUser}
            onEditUser={undefined}
            onEditMember={onEditMember}
            onAddMember={onAddMember}
          />
        </div>
      ) : (
        <div
          id="profile-panel-settings"
          role="tabpanel"
          aria-labelledby="profile-tab-settings"
        >
          <ProfileSettingsTab />
        </div>
      )}

      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loggingOut}
        className="flex min-h-12 w-full items-center justify-center gap-space-8 rounded-shape-100 bg-red-600 px-space-24 text-label-medium font-semibold text-surface transition-colors hover:bg-red-700 disabled:opacity-60 md:w-auto"
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
