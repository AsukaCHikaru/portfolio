export const SiteHeader = () => (
  <nav className="site-header_grid-wrapper">
    <div className="site-header_container">
      <div>
        <a href="/blog">blog</a>
        <a href="/about">about</a>
        {/* TODO: rss */}
      </div>
      <a href="/">ASUKA WANG</a>
    </div>
    <div className="site-header_divider" role="presentation" />
  </nav>
);
