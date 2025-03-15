# expo-ii-integration

This library enables smartphone native applications to authenticate with Internet Identity through a web application bridge. It provides a seamless integration between Expo applications and Internet Identity authentication.

## Features

- Seamless Internet Identity authentication in Expo apps
- Secure delegation chain management
- Platform-agnostic storage handling
- React hooks and context for easy integration
- Support for both web and native platforms

## Installation

```bash
npm install expo-ii-integration
```

### Dependencies

This package has the following dependencies:

```json
{
  "@dfinity/identity": "^2.3.0",
  "@higayasuo/iframe-messenger": "^0.1.0",
  "canister-manager": "^0.1.3",
  "expo-storage-universal": "^0.1.0",
  "react": "18.3.1"
}
```

And requires these peer dependencies:

```json
{
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
    iiCanisterId: 'YOUR_II_CANISTER_ID'
  });

  return (
    <IIIntegrationProvider value={iiIntegration}>
      {/* Your app components */}
    </IIIntegrationProvider>
  );
}
```

### Using the Authentication Hook

```tsx
import { useIIIntegrationContext } from 'expo-ii-integration';

function AuthButton() {
  const { login, logout, isAuthenticated } = useIIIntegrationContext();

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

The main hook for Internet Identity integration.

#### Parameters

```typescript
type UseIIAuthParams = {
  localIPAddress: string;
  dfxNetwork: string;
  iiIntegrationCanisterId: string;
  iiCanisterId: string;
};
```

#### Returns

```typescript
{
  identity: DelegationIdentity | undefined;
  isReady: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  pathWhenLogin: string | undefined;
  authError: unknown | undefined;
}
```

### IIIntegrationProvider

A context provider component for sharing authentication state.

```typescript
type IIIntegrationProviderProps = {
  children: React.ReactNode;
  value: ReturnType<typeof useIIIntegration>;
};
```

## Security

The library implements several security measures:

- Secure storage of app keys using platform-specific secure storage
- Delegation chain validation
- Automatic delegation renewal
- Secure communication between native app and web integration

## Platform Support

- iOS
- Android
- Web (through Expo)

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

MIT License
