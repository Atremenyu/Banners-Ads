import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui/material') || id.includes('@mui/system') || id.includes('@mui/base') || id.includes('@emotion')) {
              return 'vendor-mui';
            }
            if (id.includes('@mui/icons-material') || id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('jszip') || id.includes('qrcode') || id.includes('canvas-confetti')) {
              return 'vendor-tools';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('react-helmet-async')) {
              return 'vendor-react-core';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
          }
        },
      },
    },
  },
}));
