import React, { Suspense, lazy } from "react";
import { createBrowserRouter, useRouteError } from "react-router-dom";
import RootLayout from "@/app/RootLayout";

const pageModules = import.meta.glob("../pages/**/*.{js,jsx,ts,tsx}");

function normalizeRoutePath(filePath: string) {
  const relative = filePath.replace(/^\.\.\/pages\//, "");
  if (
    relative.startsWith("api/") ||
    relative.startsWith("layouts/Fashion/Components/") ||
    relative === "_app.js" ||
    relative === "_document.js"
  ) {
    return null;
  }

  let route = relative
    .replace(/\.(jsx?|tsx?)$/, "")
    .replace(/\/index$/, "")
    .replace(/\[\.\.\.(.+?)\]/g, "*$1")
    .replace(/\[(.+?)\]/g, ":$1");

  if (route === "404") return "__404__";
  if (route === "index") return "/";
  return `/${route}`.replace(/\/+/g, "/");
}

function withSuspense(Component: React.LazyExoticComponent<React.ComponentType<any>>) {
  return (
    <Suspense fallback={<div className="section-b-space text-center py-5">Loading…</div>}>
      <Component />
    </Suspense>
  );
}

function buildRoutes() {
  const entries = Object.entries(pageModules)
    .map(([file, importer]) => ({ file, importer, routePath: normalizeRoutePath(file) }))
    .filter((entry) => Boolean(entry.routePath));

  const children = entries
    .filter((entry) => entry.routePath !== "__404__")
    .sort((a, b) => {
      if (a.routePath === "/") return -1;
      if (b.routePath === "/") return 1;
      return String(a.routePath).localeCompare(String(b.routePath));
    })
    .map((entry) => {
      const Page = lazy(entry.importer as any);
      if (entry.routePath === "/") {
        return { index: true, element: withSuspense(Page) };
      }
      return {
        path: String(entry.routePath).replace(/^\//, ""),
        element: withSuspense(Page),
      };
    });

  const notFoundEntry = entries.find((entry) => entry.routePath === "__404__");
  if (notFoundEntry) {
    const NotFoundPage = lazy(notFoundEntry.importer as any);
    children.push({ path: "*", element: withSuspense(NotFoundPage) });
  }

  return children;
}

function RouterErrorBoundary() {
  const error = useRouteError() as any;
  return (
    <div className="container py-5">
      <h1>Something went wrong</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {error?.message || "Unexpected application error"}
      </pre>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouterErrorBoundary />,
    children: buildRoutes(),
  },
]);
