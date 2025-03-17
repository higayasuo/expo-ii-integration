# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2024-04-28

### Added

- Added API methods documentation to README
- Improved documentation for `clearPathWhenLogin` function

## [0.1.1] - 2024-04-28

### Added

- Added `clearPathWhenLogin` function to the context API
- Simplified context implementation

## [1.0.0] - 2024-03-15

### Added

- Initial release of the expo-ii-integration library
- Platform-specific authentication flows:
  - Web: Modal-based authentication using IIIntegrationMessenger
  - Native: Browser-based authentication using Expo WebBrowser
- Secure storage utilities:
  - `appKeyUtils` for Ed25519 key pair management
  - `delegationUtils` for delegation chain handling
  - `identityUtils` for identity creation
- Type-safe context management:
  - `IIIntegrationContext` with proper TypeScript types
  - `useIIIntegrationContext` hook with runtime validation
- Authentication state management:
  - Path tracking utilities (`pathWhenLogin`)
  - Error handling and state tracking
  - Platform-specific secure storage through expo-storage-universal
- Full TypeScript support with comprehensive type definitions
- Integration with Internet Identity system:
  - Delegation chain validation
  - Secure key storage
  - Origin validation for web messaging
