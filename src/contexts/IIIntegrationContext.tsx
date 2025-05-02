import React, { createContext, useContext } from 'react';
import { IIIntegrationType } from '../types';

// Create the context with undefined as default value
const IIIntegrationContext = createContext<IIIntegrationType | undefined>(
  undefined,
);

// Hook to use the context
export const useIIIntegrationContext = (): IIIntegrationType => {
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
  value: IIIntegrationType;
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
