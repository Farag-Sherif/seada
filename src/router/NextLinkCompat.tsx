import React from "react";
import { Link as RouterLink } from "react-router-dom";

type HrefObject = {
  pathname?: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  hash?: string;
};

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string | HrefObject;
  to?: string;
  children: React.ReactNode;
};

function hrefToString(href: string | HrefObject) {
  if (typeof href === "string") return href;
  const pathname = href.pathname || "/";
  const params = new URLSearchParams();
  Object.entries(href.query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const search = params.toString();
  const hash = href.hash ? `#${href.hash.replace(/^#/, "")}` : "";
  return `${pathname}${search ? `?${search}` : ""}${hash}`;
}

export default function NextLinkCompat({ href, to, children, target, rel, ...rest }: Props) {
  const resolved = to || hrefToString(href);
  const isExternal = /^(https?:)?\/\//.test(resolved) || resolved.startsWith("mailto:") || resolved.startsWith("tel:");

  if (isExternal || target === "_blank") {
    return (
      <a href={resolved} target={target} rel={rel || (target === "_blank" ? "noreferrer" : undefined)} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={resolved} {...(rest as any)}>
      {children}
    </RouterLink>
  );
}
