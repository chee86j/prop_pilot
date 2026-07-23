import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  // Keep backend and frontend configuration in the repository-level .env file.
  // Vite still exposes only variables prefixed with VITE_ to browser code.
  envDir: "..",
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ag-grid": ["ag-grid-community"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
    reportCompressedSize: true,
  },
  server: {
    open: true,
    cors: true,
    host: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
});
