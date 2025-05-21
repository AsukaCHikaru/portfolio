import { SiteHeader } from "./SiteHeader";
import styles from "./layout.module.css";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.site_container}>
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
};
