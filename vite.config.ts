import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config();

const API_REDIRECT = {
  target: "https://api.urlup.org/",
  changeOrigin: true,
  rewrite: (path: string) => path.replace(/^\/app\//, ""),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      "/app/create": API_REDIRECT,
      "/app/get": API_REDIRECT,
      "/app/redirect": API_REDIRECT,
    },
  },
});
