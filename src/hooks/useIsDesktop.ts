import { useEffect, useState } from "react";
import { BREAKPOINTS } from "../constants/breakpoints";

export function useIsDesktop() {
  const query = `(min-width: ${BREAKPOINTS.desktopMin}px)`;
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setIsDesktop(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return isDesktop;
}
