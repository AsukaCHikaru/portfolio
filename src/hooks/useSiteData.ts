import { useContext, useEffect } from "react";
import type { SiteData } from "../types";
import { SiteDataStoreContext } from "../components/SiteDataStore";

export const useSiteData = <S extends SiteData["section"]>(
  section: S,
): Extract<SiteData, { section: S }> | null => {
  type PageData = Extract<SiteData, { section: S }>;

  const { cache, set } = useContext(SiteDataStoreContext);
  const path =
    typeof window !== "undefined"
      ? window.location.pathname.replace(/\/$/, "")
      : "";

  const cached = cache.get(path);
  const match = cached?.section === section ? (cached as PageData) : null;

  useEffect(() => {
    if (match) {
      return;
    }
    fetch(`${path}/data.json`)
      .then((res) => res.json())
      .then((json: SiteData) => set(path, json));
  }, [match, path, set]);

  return match;
};
