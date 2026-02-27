import { useState, useEffect } from "react";
import type { SiteData } from "../types";

const dataEl =
  typeof document !== "undefined" ? document.getElementById("__DATA__") : null;
const inlineData: SiteData | null = dataEl
  ? (JSON.parse(dataEl.textContent!) as SiteData)
  : null;

export const useSiteData = <S extends SiteData["section"]>(
  section: S,
): Extract<SiteData, { section: S }> | null => {
  type PageData = Extract<SiteData, { section: S }>;

  const [data, setData] = useState<PageData | null>(
    inlineData?.section === section ? (inlineData as PageData) : null,
  );

  useEffect(() => {
    if (data) {
      return;
    }
    const path = window.location.pathname.replace(/\/$/, "");
    fetch(`${path}/data.json`)
      .then((res) => res.json())
      .then((json: PageData) => setData(json));
  }, [data]);

  return data;
};
