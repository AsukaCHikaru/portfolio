import { useContext, useEffect, useRef, type ReactNode } from "react";
import { fetchData, SiteDataStoreContext } from "./SiteDataStore";
import type { SiteData } from "../types";

const isMobile = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const prefetch = (
  path: string,
  cache: Map<string, SiteData>,
  set: (path: string, data: SiteData) => void,
) => {
  if (cache.has(path)) {
    return;
  }
  fetchData(path).then((json) => set(path, json));
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
          prefetch(to, cache, set);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, cache, set]);

  const handleHover = () => prefetch(to, cache, set);
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
