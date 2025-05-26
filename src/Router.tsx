import { useState, useEffect } from "react";
import { AboutPage } from "./pages/about/AboutPage";
import { ArchivePage } from "./pages/blog/ArchivePage";
import { PostPage } from "./pages/blog/PostPage";
import { FrontPage } from "./pages/frontpage/FrontPage";
import { ResumePage } from "./pages/resume/ResumePage";

export const Router = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
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
    return <div>404</div>;
  })();
};
