import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    // Dynamically import ESM-only plugins
    (await import('@replit/vite-plugin-shadcn-theme-json')).default(),
    (await import('@replit/vite-plugin-runtime-error-modal')).default()
  ],
  build: {
    // Ensure build is compatible with ESM
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true // Allows transformation of mixed ESM and CJS modules
    }
  }
});

