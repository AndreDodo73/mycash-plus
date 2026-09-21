import { useEffect, useState } from "react";
import avatarPlaceholder from "../../assets/sidebar/avatar-placeholder.svg";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
};

const MOCK_AVATAR_MARKERS = [
  "avatar-lucas",
  "avatar-maria",
  "avatar-pedro",
  "avatar-placeholder.png",
] as const;

function resolveAvatarSrc(src: string | null | undefined): string {
  if (!src || !src.trim()) {
    return avatarPlaceholder;
  }
  const value = src.trim();
  if (MOCK_AVATAR_MARKERS.some((marker) => value.includes(marker))) {
    return avatarPlaceholder;
  }
  return value;
}

/**
 * Foto de perfil padronizada — nunca usa avatares mock (Lucas/Maria/Pedro).
 * Sem URL válida, mostra o placeholder oficial (`avatar-placeholder`).
 */
export function Avatar({
  src,
  alt = "",
  className = "size-space-24 shrink-0 rounded-shape-100 object-cover",
  width = 24,
  height = 24,
}: AvatarProps) {
  const resolved = resolveAvatarSrc(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [resolved]);

  return (
    <img
      src={failed ? avatarPlaceholder : resolved}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export { avatarPlaceholder };
