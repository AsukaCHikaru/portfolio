import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { BlogArchiveData, SiteData } from "../types";
import type { SitePath, SitePathParam, SitePathToData } from "./Router";

type SiteDataStore = {
  cache: Map<string, SiteData>;
  set: (path: string, data: SiteData) => void;
};

export const SiteDataStoreContext = createContext<SiteDataStore>({
  cache: new Map(),
  set: () => {},
});

const filterData = (data: SiteData, params: URLSearchParams): SiteData => {
  const postCategory = params.get("category");
  if (postCategory) {
    const archiveData = data as BlogArchiveData;
    return {
      data: {
        postList: archiveData.data.postList.filter(
          (p) => p.metadata.category === postCategory,
        ),
      },
    };
  }
  return data;
};

const getInlineData = (): Map<string, SiteData> => {
  if (typeof document === "undefined") {
    return new Map();
  }

  const el = document.getElementById("__DATA__");
  if (!el) {
    return new Map();
  }

  const raw = JSON.parse(el.textContent!) as SiteData;
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  const search = window.location.search;
  const key = pathname + search;
  const data = filterData(raw, new URLSearchParams(search));
  return new Map([[key, data]]);
};

export const SiteDataStoreProvider = <P extends SitePath>({
  children,
  context,
}: {
  children: ReactNode;
  context?: Map<string, SitePathToData<P>>;
}) => {
  const [cache, setCache] = useState(context || getInlineData);

  const set = useCallback(
    (path: string, data: SiteData) =>
      setCache((prev) => new Map(prev).set(path, data)),
    [],
  );

  return (
    <SiteDataStoreContext.Provider value={{ cache, set }}>
      {children}
    </SiteDataStoreContext.Provider>
  );
};

const dataUrl = (pathname: string) =>
  pathname === "/" ? "/data.json" : `${pathname}/data.json`;

export const fetchData = async (url: URL) => {
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  const data = (await fetch(dataUrl(pathname)).then((res) =>
    res.json(),
  )) as SiteData;

  return url.search ? filterData(data, url.searchParams) : data;
};

const resolvePath = (path: string, params: Record<string, string>): string =>
  Object.entries(params).reduce(
    (resolved, [key, value]) => resolved.replace(`:${key}`, value),
    path,
  );

export const useSiteData = <P extends SitePath>(
  args: SitePathParam<P> extends never
    ? { path: P }
    : { path: P; params: Record<SitePathParam<P>, string> | undefined },
): SitePathToData<P> | null => {
  const { cache, set } = useContext(SiteDataStoreContext);
  const params = "params" in args ? args.params : undefined;
  const pathname =
    params !== undefined ? resolvePath(args.path, params) : args.path;
  const search = typeof window !== "undefined" ? window.location.search : "";
  const key = pathname + search;
  const cached = cache.get(key) as SitePathToData<P> | undefined;

  useEffect(() => {
    if (cached || ("params" in args && !params)) {
      return;
    }
    fetchData(new URL(key, window.location.origin)).then((json) =>
      set(key, json),
    );
  }, [cached, key, set, args, params]);

  if ("params" in args && !params) {
    return null;
  }

  return cached ?? null;
};
