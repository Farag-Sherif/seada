import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type RouteTarget = string | { pathname?: string; query?: Record<string, any>; hash?: string };

function buildUrl(target: RouteTarget) {
  if (typeof target === "string") return target;
  const pathname = target.pathname || "/";
  const params = new URLSearchParams();
  Object.entries(target.query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const search = params.toString();
  const hash = target.hash ? `#${String(target.hash).replace(/^#/, "")}` : "";
  return `${pathname}${search ? `?${search}` : ""}${hash}`;
}

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const query = useMemo(() => {
    const entries = Object.fromEntries(new URLSearchParams(location.search).entries());
    return { ...entries, ...params };
  }, [location.search, params]);

  const push = useCallback((target: RouteTarget) => navigate(buildUrl(target)), [navigate]);
  const replace = useCallback((target: RouteTarget) => navigate(buildUrl(target), { replace: true }), [navigate]);
  const back = useCallback(() => navigate(-1), [navigate]);

  return {
    push,
    replace,
    back,
    pathname: location.pathname,
    asPath: `${location.pathname}${location.search}${location.hash}`,
    query,
    locale: document?.documentElement?.lang || localStorage.getItem("language") || "en",
  };
}
