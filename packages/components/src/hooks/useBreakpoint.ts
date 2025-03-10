import { useEffect, useState, useMemo } from "react";
import { getBreakpoints, type BreakPoint } from "@components";
import { useHass } from "@hakit/core";

/**
 * @description This hook can be used to programmatically change the layout/content or functionality based on the current breakpoint.
 * This will return an object with all breakpoint key names and their active state.
 * @example
 * ```tsx
 * import { useBreakpoint } from "@hakit/components";
 * function SomeComponent() {
 *  const bp = useBreakpoint();
 * return (
 *   <div>
 *     {bp.xxs && <p>Extra small</p>}
 *     {bp.xs && <p>Small</p>}
 *     {bp.sm && <p>Medium</p>}
 *     {bp.md && <p>Large</p>}
 *     {bp.lg && <p>Extra large</p>}
 *   </div>
 *   );
 * }
 * @returns { [key in BreakPoint]: boolean } - Object containing the breakpoint keys and if they're active or not.
 */
export function useBreakpoint(): { [key in BreakPoint]: boolean } {
  const { useStore } = useHass();
  const breakpoints = useStore((store) => store.breakpoints);
  const _queries = useMemo(() => getBreakpoints(breakpoints), [breakpoints]);
  const initialMatches: { [key in BreakPoint]: boolean } = {
    xxs: false,
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xlg: false,
  };

  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const handleChange = (type: BreakPoint, mediaQueryList: MediaQueryList) => {
      setMatches((prev) => ({ ...prev, [type]: mediaQueryList.matches }));
    };

    const mediaQueryLists: {
      [key in BreakPoint]: MediaQueryList;
    } = {
      xxs: window.matchMedia(_queries.xxs),
      xs: window.matchMedia(_queries.xs),
      sm: window.matchMedia(_queries.sm),
      md: window.matchMedia(_queries.md),
      lg: window.matchMedia(_queries.lg),
      xlg: window.matchMedia(_queries.xlg),
    };

    // Initialize
    Object.keys(mediaQueryLists).forEach((type) => {
      handleChange(type as BreakPoint, mediaQueryLists[type as BreakPoint]);
    });

    // Add listeners
    Object.keys(mediaQueryLists).forEach((type) => {
      const mediaQueryList = mediaQueryLists[type as BreakPoint];
      mediaQueryList.addEventListener("change", (event) => handleChange(type as BreakPoint, event.currentTarget as MediaQueryList));
    });

    // Cleanup listeners
    return () => {
      Object.keys(mediaQueryLists).forEach((type) => {
        const mediaQueryList = mediaQueryLists[type as BreakPoint];
        mediaQueryList.removeEventListener("change", (event) => handleChange(type as BreakPoint, event.currentTarget as MediaQueryList));
      });
    };
  }, [_queries]);

  return matches;
}
