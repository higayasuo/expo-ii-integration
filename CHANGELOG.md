# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.7] - 2025-04-06

### Changed

- Improved security documentation in README.md:
  - Reorganized security sections to emphasize public key verification as the primary security measure
  - Added detailed explanation of deep link security with platform-specific implementations
  - Clarified the distinction between different security measures
  - Added links to source code files for better traceability
  - Improved explanation of origin validation for web messaging
  - Added documentation for `arrayBufferEquals.ts` utility, which performs the critical security check of comparing delegation chain public keys with app public keys

## [0.1.6] - 2025-04-02

### Changed

- Renamed `easFrontendPlatform` to `easDeepLinkType` for better clarity
- Updated deep link type values to use `legacy` and `modern` instead of `legacy-deep-link` and `modern-deep-link`
- Updated documentation to reflect the new parameter name and values
- Removed direct dependency on `Platform.OS` from `getDeepLinkType` function
- Added `platform` parameter to `getDeepLinkType` function for better platform handling
- Added `platform` parameter to `useIIIntegration` hook for better platform handling
- Updated tests to reflect the new `getDeepLinkType` function signature
- Improved error message formatting in `getDeepLinkType` function
- Updated peerDependencies to use `~18.3` for React to ensure compatibility
- Simplified version numbers in dependencies by removing patch versions

## [0.1.5] - 2025-03-30

### Changed

- Refactored `getEnvironment` function to accept `executionEnvironment` as a parameter
- Removed direct dependency on `Constants.executionEnvironment` in `getEnvironment` function
- Updated tests to reflect the new `getEnvironment` function signature

## [0.1.4] - 2025-03-29

### Changed

- Updated `useIIIntegration` hook parameters to use storage wrappers directly
- Removed `iiCanisterId` parameter as it's no longer needed
- Added `environment` parameter to `useIIIntegration` hook for better environment handling
- Updated documentation to reflect new storage implementation requirements
- Modified II Integration canister URL query parameters:
  - Removed `redirectUri` and `iiUri` parameters
  - Added `environment` parameter for better environment handling
  - Kept `pubkey` parameter for authentication

### Added

- Added storage wrapper imports to example code
- Improved storage initialization documentation

## [0.1.3] - 2025-03-22

### Added

- Added comprehensive JSDoc documentation to storage classes:
  - `Ed25519KeyIdentityValueStorageWrapper`
  - `DelegationChainValueStorageWrapper`
  - `AppKeyStorage`
  - `DelegationStorage`
- Improved code documentation and maintainability

## [0.1.2] - 2025-03-22

### Added

- Added API methods documentation to README
- Improved documentation for `clearPathWhenLogin` function
- Added platform-specific behavior documentation

## [0.1.1] - 2025-03-17

### Added

- Added `clearPathWhenLogin` function to the context API
- Simplified context implementation
- Added path tracking utilities for authentication flow

## [1.0.0] - 2025-03-15

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

### Added

- Added JSDoc documentation to `arrayBufferEquals.ts` utility function, which is a critical security component for verifying delegation chain public keys
