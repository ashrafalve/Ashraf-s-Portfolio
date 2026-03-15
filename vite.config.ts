import { defineConfig, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Get base URL - use environment variable or default to portfolio path
const getBaseUrl = () => {
  // Check for environment variable first
  if (process.env.VITE_BASE_URL) {
    return process.env.VITE_BASE_URL;
  }
  // Default to portfolio path for Vercel deployment
  return "/Ashraf-s-Protfolio";
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
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
  base: getBaseUrl(),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
