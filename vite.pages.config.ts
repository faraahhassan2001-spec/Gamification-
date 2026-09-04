// Standalone static-SPA build config for GitHub Pages deploys.
// Deliberately bypasses the TanStack Start / nitro pipeline in
// vite.config.ts (server-targeted) — this produces a plain
// client-rendered bundle since the app has no server functions or
// loaders (all data in src/lib/gamification.ts is client-side mock
// data), so a full SSR runtime isn't needed to serve it.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/Gamification-/",
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  build: {
    outDir: "dist-pages",
  },
});
