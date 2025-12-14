import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@web': path.resolve(__dirname, 'src/platform-web'),
      '@ui': path.resolve(__dirname, 'src/ui')
    }
  },
  server: {
    host: true
  }
});
