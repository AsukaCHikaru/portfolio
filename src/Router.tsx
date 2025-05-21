import { useState, useEffect, useCallback } from "react";
import { AboutPage } from "./pages/about/AboutPage";
import { ArchivePage } from "./pages/blog/ArchivePage";
import { PostPage } from "./pages/blog/PostPage";
import { FrontPage } from "./pages/frontpage/FrontPage";
import { Layout } from "./components/Layout";

const routes = [
  {
    path: "/blog/:slug",
    component: PostPage,
  },
  {
    path: "/blog",
    component: ArchivePage,
  },
  {
    path: "/about",
    component: AboutPage,
  },
  {
    path: "/",
    component: FrontPage,
  },
];

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

  const renderContent = useCallback(() => {
    for (const route of routes) {
      const urlPattern = new RegExp(route.path.replace(/\/:\w+/, "\/\\S+"));
      if (urlPattern.test(path)) {
        return route.component();
      }
    }
    return (
      <Layout>
        <div>404</div>;
      </Layout>
    );
  }, [path]);

  return <Layout>{renderContent()}</Layout>;
};
