import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-native',
        'expo-linking',
        'expo-router',
        'expo-web-browser',
        'expo-storage-universal',
        '@dfinity/agent',
        '@dfinity/identity',
        '@higayasuo/iframe-messenger',
        'canister-manager',
        'expo-icp-frontend-helpers',
      ],
    },
  },
  plugins: [react(), dts({ rollupTypes: true })],
});
