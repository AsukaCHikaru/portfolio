import { useState, useEffect } from "react";
import { AboutPage } from "../pages/about/AboutPage";
import { ArchivePage } from "../pages/blog/ArchivePage";
import { PostPage } from "../pages/blog/PostPage";
import { FrontPage } from "../pages/frontpage/FrontPage";
import { ResumePage } from "../pages/resume/ResumePage";
import { ListPage, ListRouter } from "../pages/list/ListPage";

export const Router = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  return (() => {
    if (/^\/$/.test(path)) {
      return <FrontPage />;
    }
    if (/\.xml$/.test(path)) {
      // TODO: fix this eslint error
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = path;
      return null;
    }
    if (/^\/blog\/[^/]+\/?$/.test(path)) {
      return <PostPage />;
    }
    if (/^\/blog\/?$/.test(path)) {
      return <ArchivePage />;
    }
    if (/^\/about\/?$/.test(path)) {
      return <AboutPage />;
    }
    if (/^\/resume\/?$/.test(path)) {
      return <ResumePage />;
    }
    if (/^\/list\/[^/]+\/?$/.test(path)) {
      return <ListRouter />;
    }
    if (/^\/list\/?$/.test(path)) {
      return <ListPage />;
    }
    return <div>404</div>;
  })();
};
