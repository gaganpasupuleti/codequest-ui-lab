import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname
const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000'
const jobsApiProxyTarget = process.env.VITE_JOBS_API_PROXY_TARGET || 'http://127.0.0.1:8001'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    },
    // Spark / hoisted deps can otherwise resolve a second copy of React; Radix then hits
    // "Cannot read properties of null (reading 'useMemo')" inside Popover/useScope.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    // Bind IPv4 explicitly — on Windows + OneDrive, `host: true` / warmup can hang the first request.
    host: '127.0.0.1',
    port: 5000,
    strictPort: true,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      '/health': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      '/jobs-api': {
        target: jobsApiProxyTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jobs-api/, ''),
      },
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 5001,
    strictPort: false,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      '/health': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      '/jobs-api': {
        target: jobsApiProxyTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jobs-api/, ''),
      },
    },
  },
});
