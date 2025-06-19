import { useState } from "react";
import { formatDate } from "../utils/dateTimeUtil";
import { Link } from "./Link";

export const SiteHeader = () => (
  <header className="site-header">
    <div className="header-content">
      <div className="header_left_content">
        <nav>
          <Link to="/blog">bl1og</Link>
          <Link to="/about">about</Link>
          <Link to="/blog/feed.xml">rss</Link>
        </nav>
        <MobileNavMenuButton />
      </div>
      <h1>
        <Link to="/">ASUKA WANG</Link>
      </h1>
      <div className="header_right_content" />
    </div>
    <div className="header-divider" />
  </header>
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
      <Link to="/blog/feed.xml">rss</Link>
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
