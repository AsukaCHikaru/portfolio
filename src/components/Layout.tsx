import { SiteHeader } from "./SiteHeader";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="site_container">
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
};
