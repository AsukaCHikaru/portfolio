import { SiteHeader } from "./SiteHeader";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SiteHeader />
      {children}
    </div>
  );
};
