const DEFAULT_REDIRECT = "/dashboard";

export function buildRedirectParam(
  pathname: string,
  search = "",
  hash = "",
) {
  const target = `${pathname}${search}${hash}`;
  return `/login?redirect=${encodeURIComponent(target)}`;
}

export function getRedirectTarget(search: string) {
  const params = new URLSearchParams(search);
  const redirect = params.get("redirect");

  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return DEFAULT_REDIRECT;
  }

  return redirect;
}
