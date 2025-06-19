import { useState } from "react";
import { formatDate } from "../utils/dateTimeUtil";
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

export const FrontPageHeader = ({ lastUpdated }: { lastUpdated: string }) => (
  <header className="frontpage-header">
    <div>
      <div className="frontpage-header_left_content">
        <p className="frontpage-header-slogan">"The Work{"\n"}Goes On"</p>
        <MobileNavMenuButton />
      </div>
      <h1>
        <Link to="/">ASUKA WANG</Link>
      </h1>
      <div className="frontpage-header_right_content">
        Last Updated{"\n"}
        <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
      </div>
    </div>
    <nav>
      <Link to="/blog">blog</Link>
      <Link to="/about">about</Link>
      <Link to="/rss">rss</Link>
    </nav>
    <div className="frontpage-header-divider" />
  </header>
);

const MobileNavMenuButton = () => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  return (
    <>
      <button
        type="button"
        className="frontpage-header-menu-button"
        onClick={() => setIsMenuShown((prev) => !prev)}
      >
        {isMenuShown ? "close" : "menu"}
      </button>
      {isMenuShown ? (
        <>
          <div className="mobile-nav-menu">
            <nav>
              <Link to="/blog">blog</Link>
              <Link to="/about">about</Link>
              <Link to="/rss">rss</Link>
            </nav>
          </div>
          <div
            className="mobile-nav-menu-backdrop"
            onClick={() => {
              console.log("backdrop clicked");
              setIsMenuShown(false);
            }}
          />
        </>
      ) : null}
    </>
  );
};
