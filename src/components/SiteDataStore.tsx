import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { BlogArchiveData, SiteData } from "../types";
import type {
  SitePath,
  SitePathParam,
  SitePathToData,
  SiteSearchParamKeys,
} from "./Router";

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

type UseSiteDataArgs<P extends SitePath> =
  SitePathParam<P> extends never
    ? SiteSearchParamKeys<P> extends never
      ? { path: P }
      : {
          path: P;
          searchParams: Record<SiteSearchParamKeys<P>, string> | undefined;
        }
    : SiteSearchParamKeys<P> extends never
      ? {
          path: P;
          pathParams: Record<SitePathParam<P>, string> | undefined;
        }
      : {
          path: P;
          pathParams: Record<SitePathParam<P>, string> | undefined;
          searchParams: Record<SiteSearchParamKeys<P>, string> | undefined;
        };

const resolvePath = (path: string, params: Record<string, string>): string =>
  Object.entries(params).reduce(
    (resolved, [key, value]) => resolved.replace(`:${key}`, value),
    path,
  );
const resolveSearch = (params: Record<string, string>): string => {
  const s = new URLSearchParams(params).toString();
  return s ? `?${s}` : "";
};

export const useSiteData = <P extends SitePath>(
  args: UseSiteDataArgs<P>,
): SitePathToData<P> | null => {
  const { cache, set } = useContext(SiteDataStoreContext);
  const pathParams = "pathParams" in args ? args.pathParams : undefined;
  const searchParams = "searchParams" in args ? args.searchParams : undefined;
  const pathname =
    pathParams !== undefined ? resolvePath(args.path, pathParams) : args.path;
  const search = searchParams ? resolveSearch(searchParams) : "";
  const key = pathname + search;
  const cached = cache.get(key) as SitePathToData<P> | undefined;

  useEffect(() => {
    if (cached || ("pathParams" in args && !pathParams)) {
      return;
    }
    fetchData(new URL(key, window.location.origin)).then((json) =>
      set(key, json),
    );
  }, [cached, key, set, args, pathParams]);

  if ("pathParams" in args && !pathParams) {
    return null;
  }

  return cached ?? null;
};
