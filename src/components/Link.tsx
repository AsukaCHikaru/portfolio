import { useContext, type ReactNode } from "react";
import { SiteDataStoreContext } from "./SiteDataStore";
import type { SiteData } from "../types";

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

  const handleMouseEnter = () => {
    const path = to.replace(/\/$/, "");
    if (cache.has(path)) return;
    fetch(`${path}/data.json`)
      .then((res) => res.json())
      .then((json: SiteData) => set(path, json))
      // TODO: implement error boundary
      .catch(() => {});
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
      href={to}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      {children}
    </a>
  );
};