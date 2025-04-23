import React, { createContext, useContext } from 'react';
import { DelegationIdentity } from '@dfinity/identity';

// Define the context type explicitly
export interface IIIntegrationContextType {
  identity: DelegationIdentity | undefined;
  isReady: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authError: unknown | undefined;
}

// Create the context with undefined as default value
const IIIntegrationContext = createContext<
  IIIntegrationContextType | undefined
>(undefined);

// Hook to use the context
export const useIIIntegrationContext = (): IIIntegrationContextType => {
  const context = useContext(IIIntegrationContext);
  if (context === undefined) {
    throw new Error(
      'useIIIntegrationContext must be used within an IIIntegrationProvider',
    );
  }
  return context;
};

// Provider component
interface IIIntegrationProviderProps {
  children: React.ReactNode;
  value: IIIntegrationContextType;
}

export const IIIntegrationProvider = ({
  children,
  value,
}: IIIntegrationProviderProps) => {
  return (
    <IIIntegrationContext.Provider value={value}>
      {children}
    </IIIntegrationContext.Provider>
  );
};
