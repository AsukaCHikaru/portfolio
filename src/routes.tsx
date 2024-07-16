import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { BlogPostListPage } from "./pages/blog/BlogPostListPage";

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
};

const routeTree = rootRoute.addChildren(Object.values(routes));
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
