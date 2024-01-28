import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URI = env.VITE_API_URI;
  if (!API_URI.trim()) throw Error("API_URI is required");

  const API_REDIRECT = {
    target: API_URI,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/app\//, ""),
  };

  if (command === "build") {
    return {
      plugins: [react()],
    };
  }

  return {
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
  };
});
