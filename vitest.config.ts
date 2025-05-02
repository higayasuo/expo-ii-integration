import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [resolve(__dirname, 'src/__tests__/setup.ts')],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'expo-web-browser': resolve(
        __dirname,
        'src/__tests__/mocks/expo-web-browser.ts',
      ),
    },
  },
});
