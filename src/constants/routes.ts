export const APP_ROUTES = [
  { path: "/", label: "Home", id: "dashboard", icon: "home" },
  { path: "/objetivos", label: "Objetivos", id: "goals", icon: "goals" },
  { path: "/cartoes", label: "Cartões", id: "cards", icon: "cards" },
  { path: "/transacoes", label: "Transações", id: "transactions", icon: "transactions" },
  { path: "/perfil", label: "Perfil", id: "profile", icon: "profile" },
] as const;

export type AppRouteId = (typeof APP_ROUTES)[number]["id"];
export type AppRouteIcon = (typeof APP_ROUTES)[number]["icon"];
