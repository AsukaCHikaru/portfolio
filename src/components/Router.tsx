import { useEffect, useState } from "react";
import { BlogPostListPage } from "../pages/blog/BlogPostListPage";
import { getBlogPost, getBlogPostList } from "../services/markdownService";
import { Layout } from "./Layout";
import { BlogPostPage } from "../pages/blog/BlogPostPage";

type Route = {
  path: string;
  render: (queryParam: string) => Promise<JSX.Element | null>;
};
const routes = {
  blogPostList: {
    path: "/blog",
    render: async () => {
      const list = await getBlogPostList();
      return <BlogPostListPage blogPostList={list} />;
    },
  },
  blog: {
    path: "/blog/:postPath",
    render: async (postPath: string) => {
      try {
        const { content, meta } = await getBlogPost(postPath);
        return <BlogPostPage content={content} meta={meta} />;
      } catch (error) {}
      return null;
    },
  },
} satisfies Record<string, Route>;

const matchRoute = () => {
  const splitedPathname = window.location.pathname
    .split("/")
    .filter((item) => item !== "");

  let result: { route: Route | null; queryParam?: string } = {
    route: null,
  };

  Object.values(routes).forEach((route: Route) => {
    const splitedRoutePath = route.path
      .split("/")
      .filter((item) => item !== "");

    if (
      result.route !== null ||
      splitedPathname.length !== splitedRoutePath.length
    ) {
      return;
    }

    if (splitedPathname.every((item, i) => splitedRoutePath[i] === item)) {
      result.route = route;
      return;
    }

    if (
      splitedRoutePath.every((item, i) =>
        item.startsWith(":") ? true : splitedPathname[i] === item,
      )
    ) {
      result.route = route;
      result.queryParam =
        splitedPathname[
          splitedRoutePath.findIndex((item) => item.startsWith(":"))
        ];
    }
  });

  return result;
};

export const Router = () => {
  const [page, setPage] = useState<JSX.Element>();

  useEffect(() => {
    const { route, queryParam } = matchRoute();
    if (route) {
      route.render(queryParam || "").then((res) => setPage(res || <>404</>));
    }
  }, []);

  return <Layout>{page}</Layout>;
};
