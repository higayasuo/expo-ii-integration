// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});

// Add any other global test setup here
// For example, you might want to add:
// - Global mocks
// - Custom matchers
// - Test utilities
