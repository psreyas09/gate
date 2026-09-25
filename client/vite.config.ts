import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const proxyConfig = {
  target: 'http://localhost:3001',
  changeOrigin: true,
  configure: (proxy: any) => {
    proxy.on('error', (_err: any, _req: any, res: any) => {
      // When Express backend is offline, return 503 JSON so proxy never falls through to static 405
      if (res && typeof res.writeHead === 'function' && !res.headersSent) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Backend offline', code: 'ECONNREFUSED' }));
      }
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': proxyConfig,
    },
  },
  preview: {
    port: 5173,
    proxy: {
      '/api': proxyConfig,
    },
  },
  build: {
    sourcemap: true,
  },
})
