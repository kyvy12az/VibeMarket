import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Tắt source map trong production để ẩn source code
    sourcemap: mode === "development",
    // Minify code để làm khó đọc
    minify: "terser",
    terserOptions: {
      compress: {
        // Xóa console.log trong production
        drop_console: mode === "production",
        drop_debugger: mode === "production",
      },
      mangle: {
        // Làm rối tên biến
        toplevel: true,
      },
      format: {
        // Xóa comments
        comments: false,
      },
    },
    // Tối ưu chunk splitting
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}));
