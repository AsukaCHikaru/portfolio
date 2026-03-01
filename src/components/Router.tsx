import { useState, useEffect, type ReactNode } from "react";
import { AboutPage } from "../pages/about/AboutPage";
import { ArchivePage } from "../pages/blog/ArchivePage";
import { PostPage } from "../pages/blog/PostPage";
import { FrontPage } from "../pages/frontpage/FrontPage";
import { ResumePage } from "../pages/resume/ResumePage";
import { ListPage } from "../pages/list/ListPage";
import { MusicAwardsListPage } from "../pages/list/MusicAwardsListPage";
import { VideoGameIndexListPage } from "../pages/list/VideoGameIndexListPage";
import { BucketListPage } from "../pages/list/BucketListPage";
import type {
  FrontPageData,
  BlogArchiveData,
  BlogData,
  ListData,
  MusicAwardsData,
  VideoGameIndexData,
  BucketListData,
  AboutData,
} from "../types";

type Route = {
  path: string;
  component: ReactNode;
};

const routes = [
  {
    path: "/",
    component: <FrontPage />,
  },
  {
    path: "/blog",
    component: <ArchivePage />,
  },
  {
    path: "/blog/:post",
    component: <PostPage />,
  },
  {
    path: "/list",
    component: <ListPage />,
  },
  {
    path: "/list/music-awards",
    component: <MusicAwardsListPage />,
  },
  {
    path: "/list/video-game-index",
    component: <VideoGameIndexListPage />,
  },
  {
    path: "/list/bucket-list",
    component: <BucketListPage />,
  },
  {
    path: "/about",
    component: <AboutPage />,
  },
  {
    path: "/resume",
    component: <ResumePage />,
  },
] as const satisfies Route[];
export type SitePath = (typeof routes)[number]["path"];

type SiteDataMap = {
  "/": FrontPageData;
  "/blog": BlogArchiveData;
  "/blog/:post": BlogData;
  "/list": ListData;
  "/list/music-awards": MusicAwardsData;
  "/list/video-game-index": VideoGameIndexData;
  "/list/bucket-list": BucketListData;
  "/about": AboutData;
  "/resume": never;
};
export type SitePathToData<P extends SitePath> = SiteDataMap[P];

export const Route = ({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) => {
  const url = new URL(window.location.href);
  const pathPattern = new RegExp(url.pathname.replace(/:[a-z-]+/g, "\\w+"));
  if (pathPattern.test(path)) {
    return null;
  }
  return children;
};

export const RouterV2 = () => {
  const [, setRenderVersion] = useState(0);

  useEffect(() => {
    const handleLocationChange = () => {
      setRenderVersion((prev) => prev + 1);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  return routes.map((route) => (
    <Route path={route.path} key={route.path}>
      {route.component}
    </Route>
  ));
};

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
    if (/^\/list\/music-awards\/?$/.test(path)) {
      return <MusicAwardsListPage />;
    }
    if (/^\/list\/video-game-index\/?$/.test(path)) {
      return <VideoGameIndexListPage />;
    }
    if (/^\/list\/bucket-list\/?$/.test(path)) {
      return <BucketListPage />;
    }
    if (/^\/list\/?$/.test(path)) {
      return <ListPage />;
    }
    return <div>404</div>;
  })();
};
