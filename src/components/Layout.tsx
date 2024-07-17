import type { FC, PropsWithChildren } from "react";
import styles from "../styles/Layout.module.css";
import { Link } from "@tanstack/react-router";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.root}>
      <SiteHeader />
      {children}
    </div>
  );
};

const SiteHeader = () => {
  return (
    <div className={styles["header-container"]}>
      <div className={styles["nav-container"]}>
        <div>
          <Link to="/blog" className={styles["nav-link"]}>
            BLOG
          </Link>
        </div>
        <Link to="/" className={styles["publication-title"]}>
          ASUKA WANG
        </Link>
      </div>
      <div className={styles["header-border"]} />
    </div>
  );
};
