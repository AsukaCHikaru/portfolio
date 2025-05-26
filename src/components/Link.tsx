import type { ReactNode } from "react";

export const Link = ({ children, to }: { children: ReactNode; to: string }) => {
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
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};
