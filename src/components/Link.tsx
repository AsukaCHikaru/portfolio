import type { ReactNode } from "react";

export const Link = ({ children, to }: { children: ReactNode; to: string }) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    console.log("Link clicked:", to);
    event.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(
      new PopStateEvent("popstate", {
        state: {},
      }),
    );
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};
