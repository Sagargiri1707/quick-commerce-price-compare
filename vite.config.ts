import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {
      "/api/blinkit": {
        target: "https://blinkit.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/blinkit/, "/v1"),
      },
      "/api/instamart": {
        target: "https://www.swiggy.com/api/instamart",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/instamart/, ""),
      },
      "/api/zepto": {
        target: "https://api.zeptonow.com/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/zepto/, ""),
      },
      "/api/bigbasket": {
        target: "https://bbnow.bigbasket.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bigbasket/, ""),
      },
    },
  },
});
