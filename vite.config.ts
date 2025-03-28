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
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-native',
        'expo-linking',
        'expo-web-browser',
        'expo-constants',
        'expo-router',
        '@dfinity/agent',
        '@dfinity/identity',
      ],
    },
  },
  plugins: [react(), dts({ rollupTypes: true })],
});
