import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.DOMAIN ? `http://${process.env.DOMAIN}:${process.env.PORT || 3000}` : 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
