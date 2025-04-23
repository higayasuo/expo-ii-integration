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

## Installation

```bash
npm install expo-ii-integration
```

### Peer Dependencies

```json
{
  "@dfinity/agent": "^0.20.2",
  "@dfinity/identity": "^0.20.2",
  "@higayasuo/iframe-messenger": "^0.1.0",
  "canister-manager": "^0.1.7",
  "expo-icp-frontend-helpers": "^0.1.4",
  "expo-linking": "~7.0",
  "expo-router": "~4.0",
  "expo-storage-universal": "^0.3.2",
  "expo-web-browser": "~14.0",
  "react": "~18.3"
}
```

## Usage

### Basic Setup

1. Wrap your app with the `IIIntegrationProvider`:

```tsx
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { IIIntegrationProvider, useIIIntegration } from 'expo-ii-integration';
import { AppKeyStorage, DelegationStorage } from 'expo-ii-integration/storage';
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

  const appKeyStorage = new AppKeyStorage(secureStorage);
  const delegationStorage = new DelegationStorage(secureStorage);

  const deepLink = Linking.createURL('/');
  const iiIntegration = useIIIntegration({
    localIPAddress: LOCAL_IP_ADDRESS,
    dfxNetwork: DFX_NETWORK,
    easDeepLinkType: process.env.EXPO_PUBLIC_EAS_DEEP_LINK_TYPE,
    deepLink,
    frontendCanisterId: CANISTER_ID_FRONTEND,
    iiIntegrationCanisterId: CANISTER_ID_II_INTEGRATION,
    appKeyStorage,
    delegationStorage,
    platform: Platform.OS,
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
  const { login, logout, isAuthenticated, isReady, identity, authError } =
    useIIIntegrationContext();

  if (!isReady) return null;

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
type UseIIAuthParams = {
  localIPAddress: string; // Local IP address for development
  dfxNetwork: string; // dfx network (e.g., 'local', 'ic')
  easDeepLinkType?: string; // EAS deep link type ('legacy' or 'modern')
  deepLink: string; // Deep link to determine the type
  frontendCanisterId: string; // Frontend canister ID
  iiIntegrationCanisterId: string; // II Integration canister ID
  platform: string; // Platform identifier (e.g., 'ios', 'android', 'web')
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper; // Storage for app's key identity
  delegationStorage: DelegationChainValueStorageWrapper; // Storage for delegation chain
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

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

MIT License
