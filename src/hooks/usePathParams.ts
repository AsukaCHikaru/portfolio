import { useContext } from "react";
import { ParamContext } from "../components/ParamContext";
import type { SitePath, SitePathParam } from "../components/Router";

type PathParamResult<P extends SitePath> =
  SitePathParam<P> extends never
    ? undefined
    : Record<SitePathParam<P>, string> | undefined;

export const usePathParams = <P extends SitePath>(
  path: P,
): PathParamResult<P> => {
  const context = useContext(ParamContext);
  const paramKeyMatch = path.match(/:([a-zA-Z\d-]+)/);

  if (!paramKeyMatch?.[1] || !context?.pathParam.length) {
    return undefined as PathParamResult<P>;
  }

  const param = context.pathParam.find((p) => p.key === paramKeyMatch[1]);
  if (!param) {
    return undefined as PathParamResult<P>;
  }

  return { [param.key]: param.value } as PathParamResult<P>;
};
