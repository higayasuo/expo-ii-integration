# expo-ii-integration

This library enables smartphone native applications to authenticate with Internet Identity through a web application bridge. It provides a seamless integration between Expo applications and Internet Identity authentication, with different authentication flows for web and native platforms.

## Features

- Seamless Internet Identity authentication in Expo apps
- Platform-specific authentication flows:
  - Web: Modal-based authentication using iframe messaging
  - Native: Browser-based authentication using Expo WebBrowser
- Secure key and delegation chain management
- Platform-agnostic secure storage handling
- Type-safe React hooks and context
- Path tracking utilities for authentication flow:
  - `pathWhenLogin`: Tracks the path when authentication was initiated
  - `clearPathWhenLogin()`: Utility to clear the saved path
- Error handling and state management

## Installation

```bash
npm install expo-ii-integration
```

### Dependencies

This package has the following peer dependencies that you need to install:

```json
{
  "@dfinity/agent": "^0.20.2",
  "@dfinity/identity": "^0.20.2",
  "expo-linking": "~7.0.5",
  "expo-router": "~4.0.17",
  "expo-web-browser": "~14.0.2",
  "react-native": "0.76.7"
}
```

## Usage

### Basic Setup

1. Wrap your app with the `IIIntegrationProvider`:

```tsx
import { IIIntegrationProvider, useIIIntegration } from 'expo-ii-integration';

function App() {
  const iiIntegration = useIIIntegration({
    localIPAddress: '192.168.0.210',
    dfxNetwork: 'local',
    iiIntegrationCanisterId: 'YOUR_II_INTEGRATION_CANISTER_ID',
    iiCanisterId: 'YOUR_II_CANISTER_ID',
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
    isReady,
    identity,
    pathWhenLogin,
    clearPathWhenLogin,
    authError,
  } = useIIIntegrationContext();

  if (!isReady) return null;

  return (
    <Button
      onPress={isAuthenticated ? logout : login}
      title={isAuthenticated ? 'Logout' : 'Login with Internet Identity'}
    />
  );
}
```

### Path Restoration Example

```tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useIIIntegrationContext } from 'expo-ii-integration';

function AuthenticationHandler() {
  const router = useRouter();
  const { isAuthenticated, pathWhenLogin, clearPathWhenLogin } =
    useIIIntegrationContext();

  // Handle path restoration after authentication
  useEffect(() => {
    if (isAuthenticated && pathWhenLogin) {
      // Navigate back to the path where login was initiated
      router.replace(pathWhenLogin);
      // Clear the saved path
      clearPathWhenLogin();
    }
  }, [isAuthenticated, pathWhenLogin, router, clearPathWhenLogin]);

  return null;
}
```

## API Reference

### useIIIntegration Hook

The main hook for Internet Identity integration.

#### Parameters

```typescript
type UseIIAuthParams = {
  localIPAddress: string; // Local IP address for development
  dfxNetwork: string; // dfx network (e.g., 'local', 'ic')
  iiIntegrationCanisterId: string; // II Integration canister ID
  iiCanisterId: string; // Internet Identity canister ID
};
```

#### Returns

```typescript
interface IIIntegrationContextType {
  identity: DelegationIdentity | undefined; // Current user identity
  isReady: boolean; // Authentication state is initialized
  isAuthenticated: boolean; // User is authenticated
  login: () => Promise<void>; // Trigger login flow
  logout: () => Promise<void>; // Clear authentication
  pathWhenLogin: string | undefined; // Path when login was initiated
  clearPathWhenLogin: () => void; // Clear the saved path
  authError: unknown | undefined; // Authentication errors
}
```

### Storage Utilities

The library provides secure storage utilities for managing authentication state:

- `appKeyUtils`: Manages Ed25519 key pairs for identity
- `delegationUtils`: Handles delegation chain storage and validation
- `identityUtils`: Creates DelegationIdentity instances

All storage operations use platform-specific secure storage through `expo-storage-universal`.

## Platform-Specific Behavior

### Web

- Uses modal-based authentication with iframe messaging
- Handles authentication flow within the same window
- Maintains application state during authentication

### Native (iOS/Android)

- Opens authentication in the system browser
- Uses URL scheme for authentication callback
- Provides utilities to restore application state after authentication

## Security Features

- Secure storage of Ed25519 key pairs
- Delegation chain validation and automatic cleanup
- Origin validation for web messaging
- Platform-specific secure storage implementations
- Type-safe interfaces and runtime validations

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

MIT License
