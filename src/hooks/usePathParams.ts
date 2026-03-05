import type { SitePath, SitePathParam } from "../components/Router";

const paramRegex = new RegExp(/:([a-zA-Z-\d]+)/g);

const isParam = <P extends SitePath>(
  value: string,
  path: P,
): value is SitePathParam<P> => new RegExp(`/:${value}/?`).test(path);

const generateRecord = <K extends string, V>(key: K, value: V) =>
  ({ [key]: value }) as Record<K, V>;

export const usePathParams = <P extends SitePath>({
  path,
}: {
  path: P;
}): Record<SitePathParam<P>, string> | undefined => {
  const paramMatch = paramRegex.exec(path);
  const paramKey = paramMatch?.[1];

  if (!paramKey || !isParam(paramKey, path) || typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  const paramValue = new RegExp(
    path.replace(paramRegex, "([a-zA-Z-\\d]+)"),
  ).exec(url.pathname)?.[1];

  if (!paramValue) {
    return;
  }

  return generateRecord(paramKey, paramValue);
};
