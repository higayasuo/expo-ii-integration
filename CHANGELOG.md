# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.16] - 2025-05-04

### Changed

- Updated peer dependencies versions:
  - `@dfinity/agent`: `^0.20.2`
  - `@dfinity/identity`: `^0.20.2`
  - `canister-manager`: `^0.1.7`
  - `expo-icp-frontend-helpers`: `^0.1.8`
  - `expo-linking`: `*`
  - `expo-router`: `*`
  - `expo-storage-universal`: `^0.3.3`
  - `expo-web-browser`: `*`
  - `react`: `*`
  - `react-native`: `*`

## [0.1.15] - 2025-05-04

### Changed

- Updated peer dependencies to use wildcard versions for Expo packages:
  - `expo-linking`: `*`
  - `expo-router`: `*`
  - `expo-web-browser`: `*`
  - Kept exact versions for React and React Native:
    - `react`: `18.3.1`
    - `react-native`: `0.76.9`

### Removed

- Removed unused test files and utilities:
  - Removed `src/test/setup.ts`
  - Removed `src/test/mocks/expo-web-browser.ts`
  - Removed `src/hooks/__tests__/dismissBrowser.spec.ts`
  - Removed `src/hooks/__tests__/getRedirectPath.spec.ts`
  - Removed `src/utils/normalizePath.ts` and its test file
  - Cleaned up test directory structure

## [0.1.14] - 2025-05-03

### Changed

- Updated peer dependencies to exact versions:
  - `expo-linking`: `~7.0.5`
  - `expo-router`: `~4.0.20`
  - `react`: `18.3.1`
  - `react-native`: `0.76.9`
- Updated README.md to match current implementation:
  - Removed `authPath` and `platform` parameters from `useIIIntegration` hook documentation
  - Added `clearAuthError` function to API reference
  - Updated type names to match implementation (`LoginArgs` to `LoginOuterParams`, `UseIIIntegrationResult` to `IIIntegrationType`)
  - Updated login function parameter name from `args` to `loginOuterParams`

## [0.1.13] - 2025-04-29

### Changed

- Refactored web authentication flow in `useIIIntegration`:
  - Replaced iframe-based authentication with WebBrowser-based approach
  - Changed to receive II integration responses via deep links instead of iframe messaging
  - Added `redirectPathStorage` parameter to `useIIIntegration` for better path management
  - Improved cross-platform consistency in authentication flow
- Removed `@higayasuo/iframe-messenger` from peer dependencies:
  - No longer needed as web authentication now uses WebBrowser instead of iframe messaging
  - Reduces package size and dependencies

## [0.1.12] - 2025-04-26

### Fixed

- Fixed navigation issue on web platform:
  - Login transition now properly occurs via the redirectPath
  - Improved handling of navigation timing in web messenger flow
  - Ensures consistent navigation behavior across platforms

## [0.1.11] - 2025-04-24

### Added

- Added `redirectPath` parameter to `login()` function in `useIIIntegration` hook:
  - Allows specifying a custom redirect path after successful login
  - Falls back to current path if not specified
  - Improves flexibility in navigation after authentication

## [0.1.10] - 2025-04-23

### Changed

- Simplified documentation in README.md:
  - Removed overly detailed security implementation details
  - Focused on essential security features and usage patterns
  - Improved clarity of installation and setup instructions
- Updated storage class documentation:
  - Simplified JSDoc comments in AppKeyStorage and DelegationStorage
  - Made documentation more concise and focused
  - Improved type safety and clarity

## [0.1.9] - 2025-04-07

### Fixed

- Fixed public key comparison in delegation chain validation:
  - Changed to compare with the last delegation's public key instead of the delegation chain's public key
  - Removed unnecessary Uint8Array conversions for ArrayBuffer comparison
  - Improved error handling for public key mismatch cases

## [0.1.8] - 2025-04-07

### Fixed

- Fixed Buffer usage in browser environment:
  - Removed all Buffer.from() calls that were causing errors in browser environments
  - Implemented browser-compatible methods for hex string conversion
  - Improved error handling for public key comparison

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
- Added `environment`
