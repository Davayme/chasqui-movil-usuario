import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeStripe } from '../services/stripeService';

type StripeContextType = {
  isStripeInitialized: boolean;
  isInitializing: boolean;
};

const StripeContext = createContext<StripeContextType>({
  isStripeInitialized: false,
  isInitializing: true,
});

export const useStripeContext = () => useContext(StripeContext);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStripeInitialized, setIsStripeInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initStripe = async () => {
      try {
        setIsInitializing(true);
        const initialized = await initializeStripe();
        setIsStripeInitialized(initialized);
      } catch (error) {
        console.error('Error al inicializar Stripe:', error);
        setIsStripeInitialized(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initStripe();
  }, []);

  return (
    <StripeContext.Provider
      value={{
        isStripeInitialized,
        isInitializing,
      }}
    >
      {children}
    </StripeContext.Provider>
  );
}; 