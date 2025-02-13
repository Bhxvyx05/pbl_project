import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: 443
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'chart.js', 'framer-motion']
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart': ['chart.js', 'react-chartjs-2'],
          'motion': ['framer-motion']
        }
      }
    }
  }
});