import type { SitePath } from "../components/Router";

const paramRegex = new RegExp(/:([a-z-\d]+)/g);

export const useLocation = ({ path }: { path: SitePath }) => {
  if (typeof window === "undefined") {
    return {
      pathname: "",
      search: undefined,
    };
  }
  const url = new URL(window.location.href);

  const paramMatch = paramRegex.exec(path);
  const paramKey = paramMatch?.[1];
  const paramValue = new RegExp(path.replace(paramRegex, "([a-z-\\d]+)")).exec(
    url.pathname,
  )?.[1];
  const params =
    paramKey && paramValue ? { [paramKey]: paramValue } : undefined;

  return {
    pathname: url.pathname,
    search: Object.fromEntries(url.searchParams),
    params,
  };
};
