import React, { createContext, useContext } from 'react';
import { DelegationIdentity } from '@dfinity/identity';

// Define the context type explicitly
export interface IIIntegrationContextType {
  identity: DelegationIdentity | undefined;
  isReady: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  pathWhenLogin: string | undefined;
  authError: unknown | undefined;
}

let IIIntegrationContext: React.Context<IIIntegrationContextType | undefined>;

function getContext() {
  if (!IIIntegrationContext) {
    IIIntegrationContext = createContext<IIIntegrationContextType | undefined>(undefined);
  }
  return IIIntegrationContext;
}

export function useIIIntegrationContext(): IIIntegrationContextType {
  const context = useContext(getContext());
  if (context === undefined) {
    throw new Error(
      'useIIIntegrationContext must be used within an IIIntegrationProvider',
    );
  }
  return context;
}

interface IIIntegrationProviderProps {
  children: React.ReactNode;
  value: IIIntegrationContextType;
}

export function IIIntegrationProvider({
  children,
  value,
}: IIIntegrationProviderProps) {
  const Context = getContext();
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
