import { defineConfig, ConfigEnv, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());
  // If we're on Vercel, use root. If on GitHub Pages (local dev/prod build), use subpath.
  const baseUrl = process.env.VERCEL ? "/" : (env.VITE_BASE_URL || "/Ashraf-s-Portfolio");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      // SPA fallback - serve index.html for all routes
      fs: {
        strict: true,
        allow: [".."]
      }
    },
    // Ensure proper SPA behavior
    appType: "spa" as const,
    plugins: [react()],
    base: baseUrl,

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
