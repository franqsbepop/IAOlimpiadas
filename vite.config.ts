import { defineConfig } from 'vite';
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import path from 'path';

export default defineConfig({
  root: './client',
  plugins: [
    esbuildCommonjs()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src')
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true // Allows transformation of mixed ESM and CJS modules
    }
  }
});





