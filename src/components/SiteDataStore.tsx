import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { BlogArchiveData, SiteData } from "../types";

type SiteDataStore = {
  cache: Map<string, SiteData>;
  set: (path: string, data: SiteData) => void;
};

export const SiteDataStoreContext = createContext<SiteDataStore>({
  cache: new Map(),
  set: () => {},
});

const dataUrl = (pathname: string) =>
  pathname === "/" ? "/data.json" : `${pathname}/data.json`;

const filterData = (data: SiteData, params: URLSearchParams): SiteData => {
  const category = params.get("category");
  if (category) {
    const archiveData = data as BlogArchiveData;
    return {
      data: {
        postList: archiveData.data.postList.filter(
          (p) => p.metadata.category === category,
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
  const data = search ? filterData(raw, new URLSearchParams(search)) : raw;
  return new Map([[key, data]]);
};

export const SiteDataStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cache, setCache] = useState(getInlineData);

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

const cacheKey = (url: URL) => {
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  return pathname + url.search;
};

export const fetchData = async (url: URL) => {
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  const data = (await fetch(dataUrl(pathname)).then((res) =>
    res.json(),
  )) as SiteData;

  return url.search ? filterData(data, url.searchParams) : data;
};

export const useSiteData = <T extends SiteData>(url: URL): T | null => {
  const { cache, set } = useContext(SiteDataStoreContext);
  const key = cacheKey(url);
  const cached = cache.get(key) as T | undefined;

  useEffect(() => {
    if (cached) {
      return;
    }
    fetchData(new URL(key, window.location.origin)).then((json) =>
      set(key, json),
    );
  }, [cached, key, set]);

  return cached ?? null;
};
