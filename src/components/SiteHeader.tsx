import { Link } from "./Link";

export const SiteHeader = () => (
  <nav className="site-header_grid-wrapper">
    <div className="site-header_container">
      <div>
        <Link to="/blog">blog</Link>
        <Link to="/about">about</Link>
        {/* TODO: rss */}
      </div>
      <Link to="/">ASUKA WANG</Link>
    </div>
    <div className="site-header_divider" role="presentation" />
  </nav>
);
