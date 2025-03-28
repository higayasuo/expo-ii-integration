# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2024-04-29

### Changed

- Updated `useIIIntegration` hook parameters to use storage wrappers directly
- Removed `iiCanisterId` parameter as it's no longer needed
- Updated documentation to reflect new storage implementation requirements
- Modified II Integration canister URL query parameters:
  - Removed `redirectUri` and `iiUri` parameters
  - Added `environment` parameter for better environment handling
  - Kept `pubkey` parameter for authentication
- Updated React peer dependency to `~18.3.1`

### Added

- Added storage wrapper imports to example code
- Improved storage initialization documentation

## [0.1.3] - 2024-04-28

### Added

- Added comprehensive JSDoc documentation to storage classes:
  - `Ed25519KeyIdentityValueStorageWrapper`
  - `DelegationChainValueStorageWrapper`
  - `AppKeyStorage`
  - `DelegationStorage`
- Improved code documentation and maintainability

## [0.1.2] - 2024-04-28

### Added

- Added API methods documentation to README
- Improved documentation for `clearPathWhenLogin` function
- Added platform-specific behavior documentation

## [0.1.1] - 2024-04-28

### Added

- Added `clearPathWhenLogin` function to the context API
- Simplified context implementation
- Added path tracking utilities for authentication flow

## [1.0.0] - 2024-03-15

### Added

- Initial release of the expo-ii-integration library
- Platform-specific authentication flows:
  - Web: Modal-based authentication using IIIntegrationMessenger
  - Native: Browser-based authentication using Expo WebBrowser
- Secure storage implementation:
  - `Ed25519KeyIdentityValueStorageWrapper` for key pair management
  - `DelegationChainValueStorageWrapper` for delegation chain handling
  - `AppKeyStorage` and `DelegationStorage` for application-specific storage
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
