import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'https://travel-backend-8d6d.onrender.com',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'http://localhost:5173',
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Forward clean Origin
            proxyReq.setHeader('Origin', 'http://localhost:5173');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Strip Secure flag and rewrite Path to / so http://localhost:5173 can store and send the cookie
            const sc = proxyRes.headers['set-cookie'];
            if (sc) {
              proxyRes.headers['set-cookie'] = sc.map((cookie) =>
                cookie
                  .replace(/;\s*Secure/gi, '')
                  .replace(/;\s*Path=\/api/gi, '; Path=/')
                  .replace(/SameSite=none/gi, 'SameSite=Lax')
              );
            }
          });
        },
      },
      '/socket.io': {
        target: 'https://travel-backend-8d6d.onrender.com',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
