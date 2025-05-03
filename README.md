# expo-ii-integration

This library enables Expo applications (both web and native) to authenticate with Internet Identity through a web application bridge. It provides a seamless integration between Expo applications and Internet Identity authentication, with different authentication flows for web and native platforms.

## Security Overview

The library implements security measures to protect against:

1. **Delegation Theft**: Prevents malicious applications from intercepting the delegation chain
2. **Cross-App Delegation Misuse**: Ensures delegations are only used by your legitimate app
3. **Phishing Attacks**: Protects against malicious apps intercepting authentication callbacks

## Features

- Seamless Internet Identity authentication in Expo apps
- Platform-specific authentication flows:
  - Web: Modal-based authentication using iframe messaging
  - Native: Browser-based authentication using Expo WebBrowser
- Secure key and delegation chain management
- Automatic path restoration after authentication
- Error handling and state management
- Support for multiple deep link paths

## Installation

```bash
npm install expo-ii-integration
```

### Peer Dependencies

```json
{
  "@dfinity/agent",
  "@dfinity/identity",
  "canister-manager",
  "expo-icp-frontend-helpers",
  "expo-linking",
  "expo-router",
  "expo-storage-universal",
  "expo-web-browser",
  "react",
  "react-native"
}
```

## Usage

### Basic Setup

1. Wrap your app with the `IIIntegrationProvider`:

```tsx
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { IIIntegrationProvider, useIIIntegration } from 'expo-ii-integration';
import {
  AppKeyStorage,
  DelegationStorage,
  RedirectPathStorage,
} from 'expo-ii-integration/storage';
import {
  LOCAL_IP_ADDRESS,
  DFX_NETWORK,
  CANISTER_ID_II_INTEGRATION,
  CANISTER_ID_FRONTEND,
} from '@/constants';

function App() {
  const isWeb = Platform.OS === 'web';
  const secureStorage = isWeb
    ? new WebSecureStorage()
    : new NativeSecureStorage();

  const regularStorage = isWeb
    ? new WebRegularStorage()
    : new NativeRegularStorage();

  const deepLink = Linking.createURL('/');
  const iiIntegration = useIIIntegration({
    localIPAddress: LOCAL_IP_ADDRESS,
    dfxNetwork: DFX_NETWORK,
    easDeepLinkType: process.env.EXPO_PUBLIC_EAS_DEEP_LINK_TYPE,
    deepLink,
    frontendCanisterId: CANISTER_ID_FRONTEND,
    iiIntegrationCanisterId: CANISTER_ID_II_INTEGRATION,
    secureStorage,
    regularStorage,
  });

  return (
    <IIIntegrationProvider value={iiIntegration}>
      {/* Your app components */}
    </IIIntegrationProvider>
  );
}
```

### Using the Authentication Context

```tsx
import { useIIIntegrationContext } from 'expo-ii-integration';

function AuthButton() {
  const {
    login,
    logout,
    isAuthenticated,
    isAuthReady,
    getIdentity,
    authError,
    clearAuthError,
  } = useIIIntegrationContext();

  if (!isAuthReady) return null;

  return (
    <Button
      onPress={isAuthenticated ? logout : login}
      title={isAuthenticated ? 'Logout' : 'Login with Internet Identity'}
    />
  );
}
```

### Login Function Arguments

The `login` function accepts an optional object with the following properties:

```typescript
type LoginOuterParams = {
  redirectPath?: string;
};
```

- `redirectPath`: The path to redirect to after successful login
  - If `redirectPath` is explicitly set to `undefined`, no redirection will occur
  - If `redirectPath` is not provided, the current path will be used
  - If `redirectPath` is provided with a path string, that path will be used

Example usage:

```tsx
// Redirect to a specific path after login
login({ redirectPath: '/dashboard' });

// No redirection after login
login({ redirectPath: undefined });

// Use current path for redirection
login();
```

## API Reference

### useIIIntegration Hook

```typescript
type UseIIIntegrationParams = {
  localIPAddress: string; // Local IP address for development
  dfxNetwork: string; // dfx network (e.g., 'local', 'ic')
  easDeepLinkType?: string; // EAS deep link type ('legacy' or 'modern')
  deepLink: string; // Deep link to determine the type
  frontendCanisterId: string; // Frontend canister ID
  iiIntegrationCanisterId: string; // II Integration canister ID
  secureStorage: Storage; // Secure storage for sensitive data
  regularStorage: Storage; // Regular storage for non-sensitive data
};

type IIIntegrationType = {
  isAuthReady: boolean; // Whether the authentication system is ready
  isAuthenticated: boolean; // Whether the user is authenticated
  getIdentity: () => Promise<Identity | undefined>; // Get the current identity
  login: (loginOuterParams?: LoginOuterParams) => Promise<void>; // Login function
  logout: () => Promise<void>; // Logout function
  authError: unknown | undefined; // Any authentication error
  clearAuthError: () => void; // Clear the authentication error
};
```

### Storage Classes

#### AppKeyStorage

```typescript
class AppKeyStorage extends Ed25519KeyIdentityValueStorageWrapper {
  constructor(storage: Storage);
}
```

#### DelegationStorage

```typescript
class DelegationStorage extends DelegationChainValueStorageWrapper {
  constructor(storage: Storage);
}
```

#### RedirectPathStorage

```typescript
class RedirectPathStorage extends StringValueStorageWrapper {
  constructor(storage: Storage);
}
```

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

MIT License
