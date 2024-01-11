import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      "/app/create": {
        target: "https://api.urlup.org/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app\//, ""),
      },
      "/app/get": {
        target: "https://api.urlup.org/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app\//, ""),
      },
      "/app/redirect": {
        target: "https://api.urlup.org/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app\//, ""),
      },
    },
  },
});
