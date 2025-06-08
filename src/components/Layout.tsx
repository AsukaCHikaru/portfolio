import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="site_container grid">
      <SiteHeader />
      <main className="grid">{children}</main>
      <SiteFooter />
    </div>
  );
};
