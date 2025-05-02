import { vi } from 'vitest';

// Mock React Native components
vi.mock('react-native', () => ({
  Image: 'Image',
  View: 'View',
  Text: 'Text',
  Platform: {
    OS: 'ios',
    select: (obj: { ios: string; android: string }) => obj.ios,
  },
}));

// Mock expo-linking
vi.mock('expo-linking', () => ({
  useURL: vi.fn(),
}));

// Mock expo-router
vi.mock('expo-router', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

// Mock expo-storage-universal
vi.mock('expo-storage-universal', () => ({
  Storage: vi.fn(),
}));

// Mock expo-web-browser
vi.mock('expo-web-browser', () => ({
  openBrowserAsync: vi.fn(),
  dismissBrowser: vi.fn(),
}));
