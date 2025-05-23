# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.24] - 2025-05-22

### Changed

- Updated `login` function to support browser options:
  - Added `openBrowserOptions` parameter to customize browser behavior
  - Uses `inNewTab` option from `expo-icp-app-connect` for better browser control
  - Updated tests to reflect new browser options support

## [0.1.23] - 2025-05-15

### Changed

- Changed URL type from string to URL object:
  - Updated `iiIntegrationUrl` parameter type in `useIIIntegration` hook
  - Improved type safety with proper URL validation
  - Updated tests to use URL objects in expectations

## [0.1.22] - 2025-05-14

### Changed

- Updated `login` function to delegate redirect path handling:
  - Removed direct redirect path storage management
  - Delegated redirect path handling to `connectToApp`
  - Simplified login process by removing redundant storage operations
  - Updated tests to reflect new redirect path handling

## [0.1.21] - 2025-05-13

### Changed

- Refactored authentication flow using `expo-icp-app-connect`:
  - Replaced direct browser handling with `connectToApp` function
  - Removed manual URL parameter handling and browser management
  - Simplified login process by delegating browser and deep link handling
  - Improved type safety with `ParamsWithSessionId` type
  - Updated tests to reflect new authentication flow

## [0.1.20] - 2025-05-12

### Changed

- Simplified `useIIIntegration` hook parameters:
  - Removed direct configuration parameters:
    - Removed `localIPAddress`
    - Removed `dfxNetwork`
    - Removed `easDeepLinkType`
    - Removed `deepLink`
    - Removed `frontendCanisterId`
    - Removed `iiIntegrationCanisterId`
  - Added simplified parameters:
    - Added `iiIntegrationUrl`: Direct URL for II integration
    - Added `deepLinkType`: Type-safe deep link configuration
  - Updated documentation to reflect new parameter structure
  - Improved type safety with `DeepLinkType` enum

## [0.1.19] - 2025-05-11

### Changed

- Changed storage key separator from `/` to `.` in `useIIIntegration` hook:
  - Updated key format for better compatibility with storage systems
  - Affects keys for app key, delegation, redirect path, and session ID storage
  - Example: `expo-ii-integration.appKey` instead of `expo-ii-integration/appKey`

## [0.1.18] - 2025-05-08

### Removed

- Removed storage wrapper classes:
  - Removed `AppKeyStorage`
  - Removed `DelegationStorage`
  - Removed `RedirectPathStorage`
  - Removed `SessionIdStorage`
- Updated documentation to reflect removal of storage classes
- Simplified storage handling by using raw Storage interface

## [0.1.17] - 2025-05-07

### Added

- Added `SessionIdStorage` class for managing session IDs:
  - Extends `StringValueStorageWrapper` for consistent storage interface
  - Uses dedicated storage key for session ID management
  - Improves security by isolating session ID storage
- Added `cryptoModule` parameter to `useIIIntegration` hook:
  - Required for secure session ID generation
  - Added to peer dependencies as `expo-crypto-universal`
  - Updated documentation to reflect new parameter

## [0.1.16] - 2025-05-05

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
  - `
