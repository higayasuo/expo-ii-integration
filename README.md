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
  "expo-crypto-universal",
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
import { buildAppConnectionURL } from 'expo-icp-app-connect-helpers';
import { buildDeepLinkType } from 'expo-icp-frontend-helpers';
import {
  LOCAL_IP_ADDRESS,
  DFX_NETWORK,
  CANISTER_ID_II_INTEGRATION,
  CANISTER_ID_FRONTEND,
} from '@/constants';
import { cryptoModule } from '@/crypto';

function App() {
  const isWeb = Platform.OS === 'web';
  const secureStorage = isWeb
    ? new WebSecureStorage()
    : new NativeSecureStorage();

  const regularStorage = isWeb
    ? new WebRegularStorage()
    : new NativeRegularStorage();

  const deepLink = Linking.createURL('/');
  const iiIntegrationUrl = buildAppConnectionURL({
    dfxNetwork: DFX_NETWORK,
    localIPAddress: LOCAL_IP_ADDRESS,
    targetCanisterId: CANISTER_ID_II_INTEGRATION,
  });
  const deepLinkType = buildDeepLinkType({
    deepLink,
    frontendCanisterId: CANISTER_ID_FRONTEND,
    easDeepLinkType: process.env.EXPO_PUBLIC_EAS_DEEP_LINK_TYPE,
  });
  const iiIntegration = useIIIntegration({
    iiIntegrationUrl,
    deepLinkType,
    secureStorage,
    regularStorage,
    cryptoModule,
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

## API Reference

### useIIIntegration Hook

```typescript
type UseIIIntegrationParams = {
  iiIntegrationUrl: string; // The II integration URL
  deepLinkType: DeepLinkType; // The deep link type ('modern', 'icp', 'dev-server', 'expo-go', 'legacy')
  secureStorage: Storage; // Secure storage for sensitive data
  regularStorage: Storage; // Regular storage for non-sensitive data
  cryptoModule: CryptoModule; // Crypto module for session ID generation
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

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

MIT License
