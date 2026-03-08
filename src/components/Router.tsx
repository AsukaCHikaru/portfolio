import { useState, useEffect, type ReactNode } from "react";
import { ParamContext } from "./ParamContext";
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
  { path: "/blog", component: <ArchivePage />, searchParamKeys: ["category"] },
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
  searchParamKeys?: string[];
}[];

const narrowSearchParams = (input: URLSearchParams, keys: string[]) =>
  Object.fromEntries(input.entries().filter(([key]) => keys.includes(key)));

export const Route = ({
  path,
  searchParamKeys = [],
  children,
}: {
  path: string;
  searchParamKeys?: string[];
  children: ReactNode;
}) => {
  const { pathname, searchParams } = new URL(window.location.href);
  const pathPattern = new RegExp(
    `${path.replace(/:([a-zA-Z-\d]+)/, "([a-zA-Z-\\d]+)")}$`,
  );
  const match = pathPattern.exec(pathname);
  if (!match) {
    return null;
  }

  const search =
    searchParams.size > 0
      ? narrowSearchParams(searchParams, searchParamKeys)
      : null;

  const paramKeyMatch = path.match(/:([a-zA-Z\d-]+)/);
  const pathParam =
    match?.[1] && paramKeyMatch?.[1]
      ? [{ key: paramKeyMatch[1], value: match[1] }]
      : [];

  return (
    <ParamContext.Provider
      value={{
        pathParam,
        searchParam: search,
      }}
    >
      {children}
    </ParamContext.Provider>
  );
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
    <Route
      path={route.path}
      key={route.path}
      searchParamKeys={route.searchParamKeys}
    >
      {route.component}
    </Route>
  ));
};
