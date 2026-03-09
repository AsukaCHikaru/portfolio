import { useContext } from "react";
import type { SitePath, SiteSearchParamKeys } from "../components/Router";
import { ParamContext } from "../components/ParamContext";

type SearchParamResult<P extends SitePath> =
  SiteSearchParamKeys<P> extends never
    ? undefined
    : Record<SiteSearchParamKeys<P>, string> | undefined;

export const useSearchParams = <P extends SitePath>(
  _path: P,
): SearchParamResult<P> => {
  const context = useContext(ParamContext);

  if (!context || !context.searchParam) {
    return undefined as SearchParamResult<P>;
  }

  return context.searchParam as SearchParamResult<P>;
};
