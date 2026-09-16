import { useEffect, useState } from "react";
import { BREAKPOINTS } from "../constants/breakpoints";

/** Alturas do plot: mobile < tablet < desktop (~300px no playbook). */
export function useChartHeight() {
  const [height, setHeight] = useState(220);

  useEffect(() => {
    const tablet = window.matchMedia(`(min-width: ${BREAKPOINTS.tabletMin}px)`);
    const desktop = window.matchMedia(
      `(min-width: ${BREAKPOINTS.desktopMin}px)`,
    );

    function sync() {
      if (desktop.matches) {
        setHeight(300);
        return;
      }
      if (tablet.matches) {
        setHeight(260);
        return;
      }
      setHeight(220);
    }

    sync();
    tablet.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    return () => {
      tablet.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  return height;
}
