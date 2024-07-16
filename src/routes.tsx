import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { BlogPostListPage } from "./pages/blog/BlogPostListPage";
import { BlogPostPage } from "./pages/blog/BlogPostPage";

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
});

const routes = {
  index: createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <Link to="/blog">blog</Link>,
  }),
  blogPostList: createRoute({
    getParentRoute: () => rootRoute,
    path: "/blog",
    component: () => <BlogPostListPage />,
  }),
  blog: createRoute({
    getParentRoute: () => rootRoute,
    path: "/blog/$postPath",
    component: () => <BlogPostPage />,
  }),
};

const routeTree = rootRoute.addChildren(Object.values(routes));
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
