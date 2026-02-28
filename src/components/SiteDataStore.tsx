import { createContext, useCallback, useState } from "react";
import type { ReactNode } from "react";
import type { SiteData } from "../types";

type SiteDataStore = {
  cache: Map<string, SiteData>;
  set: (path: string, data: SiteData) => void;
};

export const SiteDataStoreContext = createContext<SiteDataStore>({
  cache: new Map(),
  set: () => {},
});

const getInlineData = (): Map<string, SiteData> => {
  if (typeof document === "undefined") {
    return new Map();
  }

  const el = document.getElementById("__DATA__");
  if (!el) {
    return new Map();
  }

  const data = JSON.parse(el.textContent!) as SiteData;
  const path = window.location.pathname.replace(/\/$/, "");
  return new Map([[path, data]]);
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
