import { useState, useEffect, type ReactNode } from "react";
import { PathParamContext } from "./PathParamContext";
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

type SiteDataMap = {
  "/": FrontPageData;
  "/blog": BlogArchiveData;
  "/blog/:postId": BlogData;
  "/list": ListData;
  "/list/music-awards": MusicAwardsData;
  "/list/video-game-index": VideoGameIndexData;
  "/list/bucket-list": BucketListData;
  "/about": AboutData;
  "/resume": never;
};

export type SitePath = keyof SiteDataMap;
export type SitePathToData<P extends SitePath> = SiteDataMap[P];
export type SitePathParam<PATH extends SitePath> =
  PATH extends `/${string}/:${infer PARAM}`
    ? PARAM extends string
      ? PARAM
      : never
    : never;

const routes = [
  { path: "/", component: <FrontPage /> },
  { path: "/blog", component: <ArchivePage /> },
  { path: "/blog/:postId", component: <PostPage /> },
  { path: "/list", component: <ListPage /> },
  { path: "/list/music-awards", component: <MusicAwardsListPage /> },
  { path: "/list/video-game-index", component: <VideoGameIndexListPage /> },
  { path: "/list/bucket-list", component: <BucketListPage /> },
  { path: "/about", component: <AboutPage /> },
  { path: "/resume", component: <ResumePage /> },
] satisfies {
  path: SitePath;
  component: ReactNode;
}[];

export const Route = ({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) => {
  const url = new URL(window.location.href);
  const pathPattern = new RegExp(
    `${path.replace(/:([a-zA-Z-]+)/, "([a-zA-Z-]+)")}$`,
  );
  const match = pathPattern.exec(url.pathname);
  if (!match) {
    return null;
  }
  const paramKeyMatch = path.match(/:([a-zA-Z-]+)/);
  if (match?.[1] && paramKeyMatch?.[1]) {
    return (
      <PathParamContext.Provider
        value={{ pathParam: [{ key: paramKeyMatch[1], value: match[1] }] }}
      >
        {children}
      </PathParamContext.Provider>
    );
  }
  return children;
};

export const Router = () => {
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
