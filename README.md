# expo-ii-integration

This library enables Expo applications (both web and native) to authenticate with Internet Identity through a web application bridge. It provides a seamless integration between Expo applications and Internet Identity authentication, with different authentication flows for web and native platforms.

## Features

- Seamless Internet Identity authentication in Expo apps
- Platform-specific authentication flows:
  - Web (PC/Smartphone): Modal-based authentication using iframe messaging
  - Native (iOS/Android): Browser-based authentication using Expo WebBrowser
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
  "react": "^18.3.1",
  "react-native": "0.76.7"
}
```

## Usage

### Basic Setup

1. Wrap your app with the `IIIntegrationProvider`:

```tsx
import { IIIntegrationProvider, useIIIntegration } from 'expo-ii-integration';
import { AppKeyStorage } from 'expo-ii-integration/storage';
import { DelegationStorage } from 'expo-ii-integration/storage';

function App() {
  const appKeyStorage = new AppKeyStorage(storage);
  const delegationStorage = new DelegationStorage(storage);

  const iiIntegration = useIIIntegration({
    localIPAddress: '192.168.0.210',
    dfxNetwork: 'local',
    iiIntegrationCanisterId: 'YOUR_II_INTEGRATION_CANISTER_ID',
    appKeyStorage,
    delegationStorage,
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
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Href, Redirect, Tabs, usePathname } from 'expo-router';
import { LogIn } from '@/components/LogIn';
import { LogOut } from '@/components/LogOut';
import { View, ActivityIndicator } from 'react-native';
import { useIIIntegrationContext } from 'expo-ii-integration';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { identity, pathWhenLogin, clearPathWhenLogin } =
    useIIIntegrationContext();
  const pathname = usePathname();

  if (identity && pathWhenLogin) {
    clearPathWhenLogin();

    if (pathWhenLogin !== pathname) {
      console.log('redirecting to', pathWhenLogin);
      // Show loading indicator while redirecting
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#007AFF" />
          <Redirect href={pathWhenLogin as Href} />
        </View>
      );
    }
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerRight: () => (identity ? <LogOut /> : <LogIn />),
        headerStyle: {
          height: 110,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Identity',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Encryption',
          tabBarIcon: ({ color }) => <TabBarIcon name="lock" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

This example shows how to:

- Integrate path restoration with tab navigation
- Show authentication UI components in the header
- Compare the current path with the saved path to avoid unnecessary redirects
- Show a loading indicator during redirection
- Use the `Redirect` component from expo-router for navigation
- Clear the saved path after initiating the redirect

## API Reference

### useIIIntegration Hook

The main hook for Internet Identity integration.

#### Parameters

```typescript
type UseIIAuthParams = {
  localIPAddress: string; // Local IP address for development
  dfxNetwork: string; // dfx network (e.g., 'local', 'ic')
  iiIntegrationCanisterId: string; // II Integration canister ID
  appKeyStorage: Ed25519KeyIdentityValueStorageWrapper; // Storage for app's key identity
  delegationStorage: DelegationChainValueStorageWrapper; // Storage for delegation chain
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

### Storage Classes

#### Ed25519KeyIdentityValueStorageWrapper

A storage wrapper for Ed25519KeyIdentity that handles serialization and deserialization.

```typescript
class Ed25519KeyIdentityValueStorageWrapper
  implements StorageWrapper<Ed25519KeyIdentity>
{
  constructor(storage: Storage, key: string);

  find(): Promise<Ed25519KeyIdentity | undefined>;
  retrieve(): Promise<Ed25519KeyIdentity>;
  save(value: Ed25519KeyIdentity): Promise<void>;
  remove(): Promise<void>;
}
```

#### DelegationChainValueStorageWrapper

A storage wrapper for DelegationChain that includes automatic validation.

```typescript
class DelegationChainValueStorageWrapper
  implements StorageWrapper<DelegationChain>
{
  constructor(storage: Storage, key: string);

  find(): Promise<DelegationChain | undefined>;
  retrieve(): Promise<DelegationChain>;
  save(value: DelegationChain): Promise<void>;
  remove(): Promise<void>;
}
```

#### AppKeyStorage

A specialized wrapper for storing the application's Ed25519KeyIdentity.

```typescript
class AppKeyStorage extends Ed25519KeyIdentityValueStorageWrapper {
  constructor(storage: Storage);
}
```

#### DelegationStorage

A specialized wrapper for storing the application's DelegationChain.

```typescript
class DelegationStorage extends DelegationChainValueStorageWrapper {
  constructor(storage: Storage);
}
```

### API Methods

#### login()

Initiates the authentication flow:

- On web: Opens a modal with Internet Identity using iframe messaging
- On native: Opens the system browser using Expo WebBrowser
- Automatically saves the current path before initiating login
- Handles platform-specific authentication flows

#### logout()

Clears the current authentication state:

- Removes the delegation chain from storage
- Clears the identity state
- Maintains the app key for future authentication

#### clearPathWhenLogin()

Clears the saved path that was stored during login:

- Used after restoring the user to their original location
- Prevents unnecessary redirects
- Helps maintain a smooth navigation flow

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
