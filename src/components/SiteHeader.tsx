import styles from "./layout.module.css";

export const SiteHeader = () => (
  <nav className={styles.siteHeader_gridWrapper}>
    <div className={styles.siteHeader_container}>
      <div>
        <a href="/blog">blog</a>
        <a href="/about">about</a>
        {/* TODO: rss */}
      </div>
      <a href="/">ASUKA WANG</a>
    </div>
    <div className={styles.siteHeader_divider} role="presentation" />
  </nav>
);
