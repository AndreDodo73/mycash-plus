import type { AppRouteIcon } from "../../constants/routes";
import iconCreditCard from "../../assets/sidebar/icon-credit-card.svg";
import iconGoals from "../../assets/sidebar/icon-goals.svg";
import iconHome from "../../assets/sidebar/icon-home.svg";
import iconProfile from "../../assets/sidebar/icon-profile.svg";
import iconTransactions from "../../assets/sidebar/icon-transactions.svg";

const ICONS: Record<AppRouteIcon, string> = {
  home: iconHome,
  goals: iconGoals,
  cards: iconCreditCard,
  transactions: iconTransactions,
  profile: iconProfile,
};

export function SidebarIcon({
  name,
  label,
}: {
  name: AppRouteIcon;
  label: string;
}) {
  return (
    <img
      src={ICONS[name]}
      alt=""
      width={16}
      height={16}
      className="size-space-16 shrink-0"
      aria-hidden="true"
      data-icon={name}
      data-label={label}
    />
  );
}
