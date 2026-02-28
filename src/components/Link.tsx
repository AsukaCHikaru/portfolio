import { useContext, useEffect, useRef, type ReactNode } from "react";
import { fetchData, SiteDataStoreContext } from "./SiteDataStore";
import type { SiteData } from "../types";

const isMobile = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const prefetch = (to: string, set: (path: string, data: SiteData) => void) => {
  const url = new URL(to, window.location.origin);
  fetchData(url).then((json) => set(to, json));
};

export const Link = ({
  children,
  to,
  className,
}: {
  children: ReactNode;
  to: string;
  className?: string;
}) => {
  const { cache, set } = useContext(SiteDataStoreContext);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isMobile()) {
      return;
    }
    const el = ref.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          if (cache.has(to)) {
            return;
          }
          prefetch(to, set);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, cache, set]);

  const handleHover = () => {
    if (cache.has(to)) {
      return;
    }
    prefetch(to, set);
  };
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(
      new PopStateEvent("popstate", {
        state: {},
      }),
    );
  };

  return (
    <a
      ref={ref}
      href={to}
      onClick={handleClick}
      onMouseEnter={handleHover}
      className={className}
    >
      {children}
    </a>
  );
};
