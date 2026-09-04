// Client-only entry point used for the static GitHub Pages build
// (vite.pages.config.ts / `npm run build:pages`). The original
// TanStack Start SSR scaffold (src/start.ts, src/server.ts) is
// untouched — this is an additional, non-destructive entry point.
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

const PAGES_BASEPATH = "/Gamification-";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  basepath: PAGES_BASEPATH,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootEl = document.getElementById("root")!;
ReactDOM.createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
